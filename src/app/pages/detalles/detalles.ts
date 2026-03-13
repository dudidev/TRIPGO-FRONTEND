import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { MapaComponent } from '../../shared/mapa/mapa';
import { Api } from '../../api';
import { take } from 'rxjs';
import { ItinerarioService } from '../../service/itinerario.service';
import { FavoritosService,FavoritoItem } from '../../service/favoritos.service';

type Opinion = {
  usuario: string;
  comentario: string;
  rating: number;
};

type LugarDetalle = {
  // OJO: en tu app hoy este "slug" realmente es el ID que viene por la ruta /detalles/:slug
  slug: string;

  nombre: string;
  direccion: string;
  descripcion: string;
  promociones?: string;
  horarios: string[];
  imagenes: string[];
  opiniones: Opinion[];
  datosGenerales?: string[];

  //  ahora opcionales (porque desde BD puede que no vengan aún)
  lat?: number;
  lng?: number;

  // opcionales para navegación / breadcrumb
  townSlug?: string;
  categoryKey?: string;
};

@Component({
  selector: 'app-detalles',
  standalone: true,
  imports: [Nav, CommonModule, Footer, RouterModule, MapaComponent],
  templateUrl: './detalles.html',
  styleUrl: './detalles.css',
})
export class Detalles {

  townSlug: string = '';
  idTipo: number = 0;
  slug = '';

  // lugar actual (o null si no existe)
  lugar: LugarDetalle | null = null;

  // estados UI
  loading = false;
  errorMsg = '';

  itMsg = '';

  esFavorito = false;
  favMsg = '';


  constructor(private route: ActivatedRoute, private api: Api, private itinerario: ItinerarioService,   private favoritosService: FavoritosService) {}

  ngOnInit(): void {

  this.route.queryParamMap.subscribe(q => {
    this.townSlug = q.get('townSlug') || '';
    this.idTipo = Number(q.get('idTipo') || 0);
  });

  this.route.paramMap.subscribe(params => {
    this.slug = params.get('slug') || '';
    if (!this.slug) return;

    this.cargarDetalle(this.slug);
  });
}
  private cargarDetalle(idParam: string): void {
    this.loading = true;
    this.errorMsg = '';
    this.lugar = null;

    //  Opción A:
    // 1) Primero intenta en el estado global (si vienes desde la lista ya está cargado)
    this.api.establecimientos$.pipe(take(1)).subscribe({
      next: (listaEstado) => {
        const foundEnEstado = this.findById(listaEstado, idParam);
        console.log('RAW DETALLE (estado):', foundEnEstado);
        if (foundEnEstado) {
          this.lugar = this.mapToLugarDetalle(foundEnEstado, idParam);
          this.esFavorito = this.favoritosService.isFavorito(this.lugar.slug)
          this.loading = false;
          return;
        }

        // 2) Si no está (refresh o link directo), hace fallback: pedir todos
        this.api.getEstablecimientos().pipe(take(1)).subscribe({
          next: (listaBackend) => {
            const foundEnBackend = this.findById(listaBackend, idParam);
            console.log('RAW DETALLE (backend):', foundEnBackend);

            if (!foundEnBackend) {
              this.lugar = null;
              this.errorMsg =
                'No encontramos este lugar. Puede que el enlace esté mal o aún no exista información.';
              this.loading = false;
              console.log('RAW DETALLE (backend):', foundEnBackend);
              return;
            }

            this.lugar = this.mapToLugarDetalle(foundEnBackend, idParam);
            this.loading = false;
          },
          error: () => {
            this.lugar = null;
            this.errorMsg =
              'Ocurrió un error cargando el detalle desde el servidor. Intenta nuevamente.';
            this.loading = false;
          },
        });
      },
      error: () => {
        this.lugar = null;
        this.errorMsg =
          'No se pudo acceder al estado de establecimientos. Intenta nuevamente.';
        this.loading = false;
      },
    });
  }

  // Busca por id_establecimiento o id (porque en tu lista ya contemplas ambos)
  private findById(lista: any[], idParam: string): any | null {
    const id = String(idParam);

    const found =
      (lista ?? []).find((e) => String(e?.id_establecimiento ?? e?.id ?? '') === id) ??
      null;

    return found;
  }

  // Adaptador: convierte el objeto del backend a lo que tu UI espera
  private mapToLugarDetalle(raw: any, idParam: string): LugarDetalle {
    const nombre = String(raw?.nombre_establecimiento ?? raw?.nombre ?? 'Sin nombre');
    const direccion = String(raw?.direccion ?? 'Dirección no disponible');
    const descripcion = String(raw?.descripcion ?? 'Sin descripción por ahora.');

    // Imágenes: tu modelo de backend no trae imágenes, pero dejamos listo por si luego agregas
    const imagenRaw =
      raw?.imagen ??
      raw?.imagen_url ??
      raw?.foto ??
      raw?.foto_url ??
      raw?.portada ??
      null;

    const imagenes = imagenRaw ? [String(imagenRaw)] : [];

    // Horarios: construimos algo útil si hay apertura/cierre
    const apertura = raw?.horario_apertura ? String(raw.horario_apertura) : '';
    const cierre = raw?.horario_cierre ? String(raw.horario_cierre) : '';
    const horarios =
      apertura || cierre
        ? [`Horario: ${apertura || '—'} - ${cierre || '—'}`]
        : [];

    // Datos generales: armamos una lista con lo que sí venga
    const datosGenerales: string[] = [];
    if (raw?.telefono) datosGenerales.push(`Teléfono: ${raw.telefono}`);
    if (raw?.correo) datosGenerales.push(`Correo: ${raw.correo}`);
    if (raw?.estado) datosGenerales.push(`Estado: ${raw.estado}`);

    // Coordenadas: por ahora opcionales (si no vienen, el HTML no mostrará el mapa)
        const lat =
        raw?.latitud != null
          ? Number(raw.latitud)
          : raw?.lat != null
          ? Number(raw.lat)
          : raw?.latitude != null
          ? Number(raw.latitude)
          : undefined;

      const lng =
        raw?.longitud != null
          ? Number(raw.longitud)
          : raw?.lng != null
          ? Number(raw.lng)
          : raw?.longitude != null
          ? Number(raw.longitude)
          : undefined;

    // Opiniones: por ahora vacío (luego conectamos comentarios si aplica)
    const opiniones: Opinion[] = [];

    return {
      slug: String(idParam), // aquí guardamos el ID (tu ruta usa ID)
      nombre,
      direccion,
      descripcion,
      promociones: raw?.promociones ? String(raw.promociones) : undefined,
      horarios,
      imagenes,
      opiniones,
      datosGenerales: datosGenerales.length ? datosGenerales : undefined,
      lat,
      lng,

      // Si en el futuro el backend manda estos, quedará listo:
      townSlug: raw?.townSlug ? String(raw.townSlug) : undefined,
      categoryKey: raw?.categoryKey ? String(raw.categoryKey) : undefined,
    };
  }

  agregarItinerario() {
    if (!this.lugar) return;

    // (opcional) limpiar mensaje anterior
    this.itMsg = '';

    // Construimos el item con lo que ya tienes en tu LugarDetalle
    const item = {
      id: this.lugar.slug,                 // tu id actual (string)
      nombre: this.lugar.nombre,
      direccion: this.lugar.direccion,
      imagenUrl: this.lugar.imagenes?.[0] || undefined
    };

    // Guardar en el itinerario (service ya maneja storage y duplicados si lo programaste así)
    this.itinerario.add(item);

    //  feedback simple (si luego quieres mostrarlo en HTML)
    this.itMsg = 'Agregado a tu itinerario ✅';
    setTimeout(() => (this.itMsg = ''), 1500);
  }
    toggleFavorito() {
    if (!this.lugar) return;

    this.favMsg = '';

    const item: FavoritoItem = {
      id: this.lugar.slug,
      nombre: this.lugar.nombre,
      direccion: this.lugar.direccion,
      imagenUrl: this.lugar.imagenes?.[0] || undefined
    };

    const resultado = this.favoritosService.toggleFavorito(item);

    this.esFavorito = resultado;
    this.favMsg = resultado
      ? 'Agregado a favoritos ❤️'
      : 'Eliminado de favoritos 🤍';

    setTimeout(() => (this.favMsg = ''), 1500);
  }

}