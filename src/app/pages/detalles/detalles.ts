import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { MapaComponent } from '../../shared/mapa/mapa';
import { Api } from '../../api';
import { take } from 'rxjs';
import { ItinerarioService } from '../../service/itinerario.service';
import { FavoritosService, FavoritoItem } from '../../service/favoritos.service';
import { getMenuByTipo, ItemMenu, TASA_COP_USD, copToUsd } from '../../data/menuPresupuesto.data';
import { getServiciosByTipo } from '../../data/servicios-establecimiento.data';
import { environment } from '../../../environments/environment';
import { EstablecimientoService } from '../../services/establecimiento.service';
import { AuthService } from '../../services/auth.service';
import { StaggerDirective } from '../../shared/stagger.directive';
import { HapticService } from '../../shared/haptic.service';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state';

type Opinion = { usuario: string; comentario: string; rating: number; };

type LugarDetalle = {
  slug           : string;
  nombre         : string;
  id_establecimiento?: number;
  direccion      : string;
  descripcion    : string;
  promociones?   : string;
  horarios       : string[];
  imagenes       : string[] & { [n: number]: string };
  opiniones      : Opinion[];
  datosGenerales?: string[];
  servicios?     : string[];
  lat?           : number;
  lng?           : number;
  townSlug?      : string;
  categoryKey?   : string;
};

@Component({
  selector   : 'app-detalles',
  standalone : true,
  imports    : [Nav, CommonModule, Footer, 
    RouterModule, MapaComponent, FormsModule, StaggerDirective, EmptyStateComponent],
  templateUrl: './detalles.html',
  styleUrl   : './detalles.css',
})
export class Detalles implements OnInit {

  townSlug = '';
  idTipo   = 0;
  slug     = '';

  lugar    : LugarDetalle | null = null;
  loading  = false;
  errorMsg = '';
  itMsg    = '';
  favMsg   = '';
  esFavorito = false;
  imagenesLugar: any[] = [];
  loadingImagenesLugar = false;
  imagenActiva= 0;
  private sliderTimer: any;
  heroFade = true;
  // ── Reseñas ───────────────────────────────────────────────────
resenas        : any[]  = [];
estadisticas   : any    = null;
resenaLoading  = false;
resenaError    = ''
miResena       : any    = null;  // si el usuario ya tiene una reseña

// Formulario nueva reseña
mostrarFormulario = false;
mostrarConfirmacion = false;
nuevaCalificacion = 0;
nuevoComentario   = '';
resenaMsg         = '';

// Formulario edición
editando          = false;
editCalificacion  = 0;
editComentario    = '';


  // ── Calculadora ──────────────────────────────────────────────
  menuItems      : ItemMenu[] = [];
  totalCOP       = 0;
  tasaCopUsd     = TASA_COP_USD;

  // ✅ después — recalcula cuando cambia menuItems
private buildMenu(): void {
  const map = new Map<string, ItemMenu[]>();
  for (const item of this.menuItems) {
    if (!map.has(item.categoria)) map.set(item.categoria, []);
    map.get(item.categoria)!.push(item);
  }
  this.menuAgrupado = Array.from(map.entries()).map(([cat, items]) => ({ cat, items }));
}


menuAgrupado: { cat: string; items: ItemMenu[] }[] = [];

  get totalUSD(): string { return copToUsd(this.totalCOP); }
  get itemsSeleccionados(): number {
  return this.menuItems.reduce((acc, i) => acc + (i.cantidad ?? 0), 0);
  }

  
  incrementItem(item: ItemMenu): void {
  const index = this.menuItems.indexOf(item);
  if (index > -1) {
    this.menuItems[index] = { ...item, cantidad: (item.cantidad ?? 0) + 1 };
  }
  this.calcularTotal();
  this.buildMenu();
}

decrementItem(item: ItemMenu): void {
  const index = this.menuItems.indexOf(item);
  if (index > -1 && (item.cantidad ?? 0) > 0) {
    this.menuItems[index] = { ...item, cantidad: (item.cantidad ?? 0) - 1 };
  }
  this.calcularTotal();
  this.buildMenu();
}



  constructor(
    private route           : ActivatedRoute,
    public router          : Router, 
    private api             : Api,
    private itinerario      : ItinerarioService,
    private favoritosService: FavoritosService,
    private http            : HttpClient, 
    private establecimientoService: EstablecimientoService,
    public authService     : AuthService ,
    private haptic          : HapticService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(q => {
      this.townSlug = q.get('townSlug') || '';
      this.idTipo   = Number(q.get('idTipo') || 0);
    });

    // ← Ahora sí carga el detalle, ya con idTipo listo
    this.route.paramMap.pipe(take(1)).subscribe(params => {
      this.slug = params.get('slug') || '';
      if (!this.slug) return;
      this.cargarDetalle(this.slug);
    });

  }

  onFavoritoClick(event: Event): void {
  event.preventDefault();
  event.stopPropagation();

  if (!this.authService.isLoggedIn()) {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }
    });
    return;
  }

  this.toggleFavorito();
}

 getImagen(index: number): string {
  if (!this.lugar?.imagenes?.length) return '';

  // La principal rota automáticamente
  if (index === 0) {
    return this.lugar.imagenes[this.imagenActiva] ?? '';
  }

  // Las demás se acomodan dinámicamente
  const restantes = this.lugar.imagenes.filter((_, i) => i !== this.imagenActiva);
  return restantes[index - 1] ?? '';
}
private iniciarSlider(): void {
  clearInterval(this.sliderTimer);

  if (!this.lugar?.imagenes?.length || this.lugar.imagenes.length <= 1) return;

  this.sliderTimer = setInterval(() => {
    if (!this.lugar?.imagenes?.length) return;

    this.heroFade = false;

    setTimeout(() => {
      this.imagenActiva = (this.imagenActiva + 1) % this.lugar!.imagenes.length;
      this.heroFade = true;
    }, 500);
  }, 5000);
}
ngOnDestroy(): void {
  clearInterval(this.sliderTimer);
}

  // ── Carga detalle ─────────────────────────────────────────────
  private cargarDetalle(idParam: string): void {
    this.loading  = true;
    this.errorMsg = '';
    this.lugar    = null;

    this.api.establecimientos$.pipe(take(1)).subscribe({
      next: (listaEstado) => {
        const found = this.findAllById(listaEstado, idParam);
        if (found.length) { this.setLugar(found, idParam); return; }

        this.api.getEstablecimientos().pipe(take(1)).subscribe({
          next: (listaBackend) => {
            const found2 = this.findAllById(listaBackend, idParam);
            if (!found2.length) {
              this.errorMsg = 'No encontramos este lugar.';
              this.loading  = false; return;
            }
            this.setLugar(found2, idParam);
          },
          error: () => { this.errorMsg = 'Error cargando detalle.'; this.loading = false; }
        });
      },
      error: () => { this.errorMsg = 'Error de conexión.'; this.loading = false; }
    });
  }


  private registrarVisualizacion(idEstablecimiento: number): void {
  const token = localStorage.getItem('token');
  if (!token) return;
  this.http.post(
    `${this.apiUrl}/recomendaciones/registrar-visualizacion`,
    { id_establecimiento: idEstablecimiento, tiempo_visualizacion: 0 },
    { headers: { Authorization: `Bearer ${token}` } }
  ).subscribe();
}




 private setLugar(rows: any[], idParam: string): void {
  const lugarMapeado = this.mapToLugarDetalle(rows, idParam);

  this.lugar = lugarMapeado;
  this.esFavorito = this.favoritosService.isFavorito(lugarMapeado.slug);

  if (!this.lugar.servicios?.length) {
    this.lugar.servicios = getServiciosByTipo(this.idTipo);
  }

  this.initMenu(rows[0]);
  this.cargarResenas();
  this.registrarVisualizacion(Number(idParam));

  const idLugar = lugarMapeado.id_establecimiento ?? Number(idParam);
  this.cargarImagenesLugar(idLugar);

  this.loading = false;
}

 private cargarImagenesLugar(id: number): void {
  if (!id) {
    this.imagenesLugar = [];
    return;
  }

  this.loadingImagenesLugar = true;

  this.establecimientoService.getImagenesLugar(id).subscribe({
    next: (resp: any) => {
      this.imagenesLugar = resp?.imagenes ?? [];
      this.loadingImagenesLugar = false;

      const urls = this.imagenesLugar
        .map((img: any) => img?.url)
        .filter((url: any) => !!url)
        .map((url: any) => String(url));

      if (this.lugar && urls.length > 0) {
        this.lugar = {
          ...this.lugar,
          imagenes: [...new Set(urls)]
        };

        // ✅ reinicia en la primera imagen
        this.imagenActiva = 0;

        // ✅ arranca el slider automático
        if (this.lugar.imagenes.length > 1) {
          this.iniciarSlider();
        }
      }

      // console.log('IMAGENES DETALLE BACKEND:', this.imagenesLugar);
      // console.log('IMAGENES DETALLE FINALES:', this.lugar?.imagenes);
    },
    error: (err: any) => {
      console.error('getImagenesLugar detalle error:', err);
      this.imagenesLugar = [];
      this.loadingImagenesLugar = false;
    }
  });
}

  // ── Calculadora ───────────────────────────────────────────────
  private initMenu(raw: any): void {
  console.log('>>> idTipo:', this.idTipo); // ← agrega esto
  const backendProductos = raw?.productos ?? raw?.menu ?? null;
  if (Array.isArray(backendProductos) && backendProductos.length) {
    this.menuItems = backendProductos.map((p: any) => ({
      categoria: String(p.categoria ?? '📋 Servicios'),
      nombre   : String(p.nombre ?? p.name ?? 'Servicio'),
      precio   : Number(p.precio ?? p.price ?? 0),
      selected : false,
      cantidad : 0,

    }));
  } else {
    this.menuItems = getMenuByTipo(this.idTipo);
  }
  this.calcularTotal();
  this.buildMenu();
}

  // ✅ después — reemplaza el objeto, Angular detecta el cambio
toggleItem(item: ItemMenu): void {
  const index = this.menuItems.indexOf(item);
  if (index > -1) {
    this.menuItems[index] = { ...item, selected: !item.selected };
  }
  this.calcularTotal();
  this.buildMenu();
}

 private calcularTotal(): void {
  this.totalCOP = this.menuItems
    .reduce((acc, i) => acc + i.precio * (i.cantidad ?? 0), 0);
}

  // ── Favoritos ─────────────────────────────────────────────────
  toggleFavorito(): void {
    if (!this.lugar) return;
    const item: FavoritoItem = {
      id       : this.lugar.slug,
      nombre   : this.lugar.nombre,
      direccion: this.lugar.direccion,
      imagenUrl: this.lugar.imagenes?.[0] || undefined
    };
    this.favoritosService.toggleFavorito(item).subscribe(esAhoraFavorito => {
      this.esFavorito = esAhoraFavorito;
      this.favMsg     = esAhoraFavorito ? 'Agregado a favoritos ❤️' : 'Eliminado de favoritos 🤍';
      setTimeout(() => (this.favMsg = ''), 1500);
    });
  }

  // ── Itinerario ────────────────────────────────────────────────
  agregarItinerario(): void {
  // 🔐 Si no está logueado, redirige al login con returnUrl
  if (!this.authService.isLoggedIn()) {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }
    });
    return;
  }

  if (!this.lugar) return;

  const productosSeleccionados = this.menuItems
    .filter(i => (i.cantidad ?? 0) > 0)
    .map(i => ({
      nombre   : i.nombre,
      precio   : i.precio,
      categoria: i.categoria,
      cantidad : i.cantidad ?? 1,
    }));

  this.itinerario.add({
    id       : this.lugar.slug,
    nombre   : this.lugar.nombre,
    direccion: this.lugar.direccion,
    imagenUrl: this.lugar.imagenes?.[0] || undefined,
    productos: productosSeleccionados.length ? productosSeleccionados : undefined,
  });

  this.itMsg = '✓';
  setTimeout(() => (this.itMsg = ''), 1500);
}
  // ── Helpers ───────────────────────────────────────────────────
  private findAllById(lista: any[], idParam: string): any[] {
    const id = String(idParam);
    return (lista ?? []).filter(e => String(e?.id_establecimiento ?? e?.id ?? '') === id);
  }

  private mapToLugarDetalle(rows: any[], idParam: string): LugarDetalle {
    const base = rows[0] ?? {};

     

    const nombre      = String(base?.nombre_establecimiento ?? base?.nombre ?? 'Sin nombre');
    const direccion   = String(base?.direccion ?? 'Dirección no disponible');
    const descripcion = String(base?.descripcion ?? 'Sin descripción por ahora.');

    const imagenes = [...new Set(
      rows
        .map((r: any) => r?.imagen ?? r?.imagen_url ?? r?.foto ?? r?.foto_url ?? r?.portada ?? r?.url ?? null)
        .filter(Boolean).map(String)
    )];

    const apertura = base?.horario_apertura ? String(base.horario_apertura) : '';
    const cierre   = base?.horario_cierre   ? String(base.horario_cierre)   : '';
    const horarios = apertura || cierre ? [`${apertura || '—'} — ${cierre || '—'}`] : [];

    const datosGenerales: string[] = [];
    if (base?.telefono) datosGenerales.push(`Teléfono: ${base.telefono}`);
    if (base?.correo)   datosGenerales.push(`Correo: ${base.correo}`);
    // if (base?.estado)   datosGenerales.push(`Estado: ${base.estado}`);

    const servicios: string[] = Array.isArray(base?.servicios)
      ? base.servicios.map(String)
      : typeof base?.servicios === 'string' && base.servicios
        ? base.servicios.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];

    const lat = base?.latitud  != null ? Number(base.latitud)   :
                base?.lat      != null ? Number(base.lat)       :
                base?.latitude != null ? Number(base.latitude)  : undefined;
    const lng = base?.longitud  != null ? Number(base.longitud)  :
                base?.lng       != null ? Number(base.lng)       :
                base?.longitude != null ? Number(base.longitude) : undefined;

    return {
  slug: String(idParam), nombre, direccion, descripcion,
  id_establecimiento: Number(base?.id_establecimiento ?? idParam), // ← AGREGAR
  promociones   : base?.promociones ? String(base.promociones) : undefined,
  horarios, imagenes, opiniones: [],
  datosGenerales: datosGenerales.length ? datosGenerales : undefined,
  servicios     : servicios.length ? servicios : undefined,
  lat, lng,
  townSlug  : base?.townSlug    ? String(base.townSlug)    : undefined,
  categoryKey: base?.categoryKey ? String(base.categoryKey) : undefined,
};
  }

 private getAuthHeaders(): HttpHeaders {
  const token = localStorage.getItem('token');
  console.log('TOKEN:', token ? token.substring(0, 20) + '...' : 'NULL');
  return new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type' : 'application/json'
  });
}

private get apiUrl(): string {
  return environment.apiBaseUrl;
}

cargarResenas(): void {
  const id = this.lugar?.id_establecimiento;
  if (!id) return;

  this.resenaLoading = true;
  this.resenaError   = '';

  const token = localStorage.getItem('token');
  const headers = new HttpHeaders(
    token ? { 'Authorization': `Bearer ${token}` } : {}
  );

  // ← toma el id del usuario logueado
  const usuarioGuardado = JSON.parse(localStorage.getItem('user') || '{}');
  const miId = usuarioGuardado?.id ?? null;

  this.http.get<any>(
    `${this.apiUrl}/establecimientos/${id}/resenas`,
    { headers }
  ).subscribe({
    next: (data) => {
      this.estadisticas  = data.estadisticas;
       // ← compara por id del usuario
  this.miResena = miId
    ? (data.resenas?.find((r: any) => r.usuario?.id === miId) ?? null)
    : null;

  // ← filtra tu reseña de la lista para no duplicarla ← NUEVO
  this.resenas = miId
    ? (data.resenas?.filter((r: any) => r.usuario?.id !== miId) ?? [])
    : (data.resenas ?? []);

  console.log('miResena:', this.miResena);
  this.resenaLoading = false;
    },
    error: () => {
      this.resenaError   = 'No se pudieron cargar las reseñas.';
      this.resenaLoading = false;
    }
  });
}

crearResena(): void {
  const id = this.lugar?.id_establecimiento;
  if (!id || !this.nuevaCalificacion || !this.nuevoComentario.trim()) return;

  const token = localStorage.getItem('token');  // ← toma el token directo
  
  this.http.post<any>(
    `${this.apiUrl}/resenas`,                   // ← verifica que apiUrl tenga http://localhost:8080
    {
      id_establecimiento: id,
      calificacion      : this.nuevaCalificacion,
      comentario        : this.nuevoComentario.trim()
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type' : 'application/json'
      }
    }
  ).subscribe({
    next: () => {
      this.resenaMsg         = '¡Reseña publicada!';
      this.mostrarFormulario = false;
      this.nuevaCalificacion = 0;
      this.nuevoComentario   = '';
      this.cargarResenas();
      setTimeout(() => (this.resenaMsg = ''), 2000);
    },
    error: (err) => {
      console.error('Error reseña:', err); // ← agrega esto para ver el error real
      this.resenaMsg = err.error?.message || 'Error al publicar la reseña.';
    }
  });
}

eliminarResena(): void {
  if (!this.miResena) return;

  this.mostrarConfirmacion = true;
}
cancelarEliminacion(): void {
  this.mostrarConfirmacion = false;
}
confirmarEliminacion(): void {
  if (!this.miResena) return;

  const token = localStorage.getItem('token');

  this.http.delete(`${this.apiUrl}/resenas/${this.miResena.id_resena}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).subscribe({
    next: () => {
      this.miResena = null;
      this.resenaMsg = 'Reseña eliminada.';
      this.mostrarConfirmacion = false;
      this.cargarResenas();

      setTimeout(() => (this.resenaMsg = ''), 2000);
    },
    error: (err) => {
      console.error('Error eliminar:', err);
      this.resenaMsg = err.error?.message || 'Error al eliminar.';
      this.mostrarConfirmacion = false;
    }
  });
}

guardarEdicion(): void {
  if (!this.miResena) return;

  const token = localStorage.getItem('token');

  this.http.put<any>(
    `${this.apiUrl}/resenas/${this.miResena.id_resena}`,
    {
      calificacion: this.editCalificacion,
      comentario  : this.editComentario.trim()
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type' : 'application/json'
      }
    }
  ).subscribe({
    next: () => {
      this.editando  = false;
      this.resenaMsg = 'Reseña actualizada.';
      this.cargarResenas();
      setTimeout(() => (this.resenaMsg = ''), 2000);
    },
    error: (err) => {
      console.error('Error editar:', err);
      this.resenaMsg = err.error?.message || 'Error al actualizar.';
    }
  });
}
iniciarEdicion(): void {
  if (!this.miResena) return;
  this.editando        = true;
  this.editCalificacion = this.miResena.calificacion;
  this.editComentario   = this.miResena.comentario;
}

setCalificacion(valor: number): void {
  this.nuevaCalificacion = valor;
}

setEditCalificacion(valor: number): void {
  this.editCalificacion = valor;
}





}
