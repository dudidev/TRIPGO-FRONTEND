import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { MapaComponent } from '../../shared/mapa/mapa';
import { Api } from '../../api';
import { take } from 'rxjs';
import { ItinerarioService } from '../../service/itinerario.service';
import { FavoritosService, FavoritoItem } from '../../service/favoritos.service';

type Opinion = {
  usuario: string;
  comentario: string;
  rating: number;
};

type LugarDetalle = {
  slug: string;
  nombre: string;
  direccion: string;
  descripcion: string;
  promociones?: string;
  horarios: string[];
  imagenes: string[];
  opiniones: Opinion[];
  datosGenerales?: string[];
  lat?: number;
  lng?: number;
  townSlug?: string;
  categoryKey?: string;
};

@Component({
  selector: 'app-detalles',
  standalone: true,
  imports: [Nav, CommonModule, Footer, RouterModule, MapaComponent,],
  templateUrl: './detalles.html',
  styleUrl: './detalles.css',
})
export class Detalles {
  townSlug: string = '';
  idTipo: number = 0;
  slug = '';

  lugar: LugarDetalle | null = null;

  loading = false;
  errorMsg = '';

  itMsg = '';

  esFavorito = false;
  favMsg = '';

  constructor(
    private route: ActivatedRoute,
    private api: Api,
    private itinerario: ItinerarioService,
    private favoritosService: FavoritosService
  ) {}

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

    this.api.establecimientos$.pipe(take(1)).subscribe({
      next: (listaEstado) => {
        const encontradosEnEstado = this.findAllById(listaEstado, idParam);
        console.log('RAW DETALLE (estado):', encontradosEnEstado);

        if (encontradosEnEstado.length) {
          this.lugar = this.mapToLugarDetalle(encontradosEnEstado, idParam);
          this.esFavorito = this.favoritosService.isFavorito(this.lugar.slug);
          this.loading = false;
          return;
        }

        this.api.getEstablecimientos().pipe(take(1)).subscribe({
          next: (listaBackend) => {
            const encontradosEnBackend = this.findAllById(listaBackend, idParam);
            console.log('RAW DETALLE (backend):', encontradosEnBackend);

            if (!encontradosEnBackend.length) {
              this.lugar = null;
              this.errorMsg =
                'No encontramos este lugar. Puede que el enlace esté mal o aún no exista información.';
              this.loading = false;
              return;
            }

            this.lugar = this.mapToLugarDetalle(encontradosEnBackend, idParam);
            this.esFavorito = this.favoritosService.isFavorito(this.lugar.slug);
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

  // Busca TODAS las filas relacionadas con el mismo establecimiento
  private findAllById(lista: any[], idParam: string): any[] {
    const id = String(idParam);

    return (lista ?? []).filter(
      (e) => String(e?.id_establecimiento ?? e?.id ?? '') === id
    );
  }

  // Convierte varias filas del mismo establecimiento en un solo objeto detalle
  private mapToLugarDetalle(rows: any[], idParam: string): LugarDetalle {
    const base = rows[0] ?? {};

    const nombre = String(base?.nombre_establecimiento ?? base?.nombre ?? 'Sin nombre');
    const direccion = String(base?.direccion ?? 'Dirección no disponible');
    const descripcion = String(base?.descripcion ?? 'Sin descripción por ahora.');

    // Toma todas las imágenes relacionadas a ese id
    const imagenes = rows
      .map((row: any) =>
        row?.imagen ??
        row?.imagen_url ??
        row?.foto ??
        row?.foto_url ??
        row?.portada ??
        row?.url ??
        null
      )
      .filter((img: any) => !!img)
      .map((img: any) => String(img));

    // Quita duplicadas por si el backend repite alguna
    const imagenesUnicas = [...new Set(imagenes)];

    const apertura = base?.horario_apertura ? String(base.horario_apertura) : '';
    const cierre = base?.horario_cierre ? String(base.horario_cierre) : '';
    const horarios =
      apertura || cierre
        ? [`Horario: ${apertura || '—'} - ${cierre || '—'}`]
        : [];

    const datosGenerales: string[] = [];
    if (base?.telefono) datosGenerales.push(`Teléfono: ${base.telefono}`);
    if (base?.correo) datosGenerales.push(`Correo: ${base.correo}`);
    if (base?.estado) datosGenerales.push(`Estado: ${base.estado}`);

    const lat =
      base?.latitud != null
        ? Number(base.latitud)
        : base?.lat != null
        ? Number(base.lat)
        : base?.latitude != null
        ? Number(base.latitude)
        : undefined;

    const lng =
      base?.longitud != null
        ? Number(base.longitud)
        : base?.lng != null
        ? Number(base.lng)
        : base?.longitude != null
        ? Number(base.longitude)
        : undefined;

    const opiniones: Opinion[] = [];

    return {
      slug: String(idParam),
      nombre,
      direccion,
      descripcion,
      promociones: base?.promociones ? String(base.promociones) : undefined,
      horarios,
      imagenes: imagenesUnicas,
      opiniones,
      datosGenerales: datosGenerales.length ? datosGenerales : undefined,
      lat,
      lng,
      townSlug: base?.townSlug ? String(base.townSlug) : undefined,
      categoryKey: base?.categoryKey ? String(base.categoryKey) : undefined,
    };
  }

  agregarItinerario() {
    if (!this.lugar) return;

    this.itMsg = '';

    const item = {
      id: this.lugar.slug,
      nombre: this.lugar.nombre,
      direccion: this.lugar.direccion,
      imagenUrl: this.lugar.imagenes?.[0] || undefined
    };

    this.itinerario.add(item);

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