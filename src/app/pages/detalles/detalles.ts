import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { MapaComponent } from '../../shared/mapa/mapa';
import { Api } from '../../api';
import { take } from 'rxjs';
import { ItinerarioService } from '../../service/itinerario.service';
import { FavoritosService, FavoritoItem } from '../../service/favoritos.service';
import { getMenuByTipo, ItemMenu, TASA_COP_USD, copToUsd } from '../../data/menuPresupuesto.data';
import { getServiciosByTipo } from '../../data/servicios-establecimiento.data';

type Opinion = { usuario: string; comentario: string; rating: number; };

type LugarDetalle = {
  slug           : string;
  nombre         : string;
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
  imports    : [Nav, CommonModule, Footer, RouterModule, MapaComponent],
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
  get itemsSeleccionados(): number { return this.menuItems.filter(i => i.selected).length; }

  constructor(
    private route           : ActivatedRoute,
    private api             : Api,
    private itinerario      : ItinerarioService,
    private favoritosService: FavoritosService
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

  getImagen(index: number): string {
  return this.lugar?.imagenes?.[index] ?? '';
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

  private setLugar(rows: any[], idParam: string): void {
    this.lugar     = this.mapToLugarDetalle(rows, idParam);
    this.esFavorito= this.favoritosService.isFavorito(this.lugar.slug);

     // Si el backend no trae servicios, usa los quemados por tipo
  if (!this.lugar.servicios?.length) {
    this.lugar.servicios = getServiciosByTipo(this.idTipo);
  }

    this.initMenu(rows[0]);
    this.loading   = false;
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
      selected : false
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
    .filter(i => i.selected)
    .reduce((acc, i) => acc + i.precio, 0);
  console.log('Total:', this.totalCOP, 'Items:', this.menuItems.filter(i=>i.selected).length);
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
    this.esFavorito = this.favoritosService.toggleFavorito(item);
    this.favMsg     = this.esFavorito ? 'Agregado a favoritos ❤️' : 'Eliminado de favoritos 🤍';
    setTimeout(() => (this.favMsg = ''), 1500);
  }

  // ── Itinerario ────────────────────────────────────────────────
  agregarItinerario(): void {
    if (!this.lugar) return;
    this.itinerario.add({
      id       : this.lugar.slug,
      nombre   : this.lugar.nombre,
      direccion: this.lugar.direccion,
      imagenUrl: this.lugar.imagenes?.[0] || undefined
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
    if (base?.estado)   datosGenerales.push(`Estado: ${base.estado}`);

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
      promociones   : base?.promociones ? String(base.promociones) : undefined,
      horarios, imagenes, opiniones: [],
      datosGenerales: datosGenerales.length ? datosGenerales : undefined,
      servicios     : servicios.length ? servicios : undefined,
      lat, lng,
      townSlug  : base?.townSlug    ? String(base.townSlug)    : undefined,
      categoryKey: base?.categoryKey ? String(base.categoryKey) : undefined,
    };
  }
}
