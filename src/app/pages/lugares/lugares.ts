import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { Api } from '../../api';
import { Subject, takeUntil } from 'rxjs';
import { LUGARES_DATA } from '../../data/lugares.data';

type CardItem = {
  slug: string;
  titulo: string;
  img: string;
};

@Component({
  selector: 'app-lugares',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Nav, Footer],
  templateUrl: './lugares.html',
  styleUrl: './lugares.css'
})
export class LugaresComponent implements OnDestroy {
  query = '';

  townSlug = '';
  idTipo = 0;

  // ✅ título dinámico
  titulo = 'Establecimientos';

  // ✅ HERO
  heroImgs: string[] = [];
  heroIndex = 0;
  private heroTimerId: any = null;

  items: CardItem[] = [];
  filtered: CardItem[] = [];

  loading = false;
  errorMsg = '';

  private destroy$ = new Subject<void>();

// ✅ Mapea idTipo -> key dentro de LUGARES_DATA[town][key]
// AJUSTA según tus ids reales:
private TIPO_KEY_BY_ID: Record<number, string> = {
  14: 'valle-cocora',
  1: 'hotel',
  20 : 'mirador',
  18: 'senderismo'

  
};

private getTipoKey(): string {
  return this.TIPO_KEY_BY_ID[this.idTipo] ?? '';
}

private applyLugaresDataToItems() {
  const town = (this.townSlug || '').toLowerCase().trim();
  const tipoKey = this.getTipoKey();
  if (!town || !tipoKey) return;

  const pack = LUGARES_DATA?.[town]?.[tipoKey];
  if (!pack) return;

  // ✅ si tu data tiene titulo y hero, úsalo
  if (pack.titulo) this.titulo = `${pack.titulo} en ${this.townSlug}`;

  if (pack.heroImgs?.length) {
    this.heroImgs = pack.heroImgs;
    this.heroIndex = 0;
    this.startHero();
  }

  // ✅ armar mapa slug->img
  const imgBySlug = new Map<string, string>(
    (pack.items ?? []).map(x => [String(x.slug), String(x.img)])
  );

    // ✅ DEBUG para confirmar que existe slug "6"
  console.log('town:', town, 'idTipo:', this.idTipo, 'tipoKey:', tipoKey);
  console.log('slugs en backend:', this.items.map(x => x.slug));
  console.log('slugs en data:', [...imgBySlug.keys()]);

  // ✅ aplicar imagen por slug (id_establecimiento)
  this.items = this.items.map(it => ({
    ...it,
    img: imgBySlug.get(String(it.slug)) ?? it.img
  }));

  this.filtered = this.applySearch(this.query);
}



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: Api
  ) {}

  ngOnInit(): void {
    console.log('✅ LugaresComponent.ngOnInit ejecutado');

    // 1) Estado global de establecimientos
    this.api.establecimientos$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any[]) => {
          this.items = (data ?? []).map((e: any) => ({
            slug: String(e.id_establecimiento ?? e.id ?? 'sin-id'),
            titulo: e.nombre_establecimiento ?? e.nombre ?? e.direccion ?? 'Sin nombre',
            img: e.imagen ?? 'https://via.placeholder.com/600x400?text=Establecimiento'
          }));

           this.applyLugaresDataToItems();

          this.filtered = this.applySearch(this.query);
          this.loading = false;

          if (!this.items.length) {
            this.errorMsg = 'No hay establecimientos registrados para este tipo en este pueblo.';
          } else {
            this.errorMsg = '';
          }
        },
        error: () => {
          this.items = [];
          this.filtered = [];
          this.loading = false;
          this.errorMsg = 'Error cargando establecimientos';
        }
      });

    // 2) Leer parámetros: /lugares/:townSlug/tipo/:idTipo
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.townSlug = params.get('townSlug') || '';
        this.idTipo = Number(params.get('idTipo') || 0);

        // ✅ HERO por pueblo SIEMPRE (así no se rompe Filandia)
        this.setHeroByTownSlug(this.townSlug);

        if (!this.townSlug || !this.idTipo) {
          this.items = [];
          this.filtered = [];
          this.loading = false;
          this.errorMsg = 'Ruta inválida: falta townSlug o idTipo';
          return;
        }

        // ✅ Reset UI
        this.loading = true;
        this.errorMsg = '';
        this.items = [];
        this.filtered = [];
        this.query = '';

        // ✅ título: traer nombre del tipo
        this.titulo = `Establecimientos en ${this.townSlug}`;
        this.api.getTipoNombreById(this.idTipo)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (nombre) => {
              this.titulo = `${nombre} en ${this.townSlug}`;
              // ❌ NO pises el hero por tipo. El hero es por pueblo.
              // this.setHeroByTipoNombre(nombre);
            },
            error: () => {
              this.titulo = `Establecimientos en ${this.townSlug}`;
              // si falla, igual mantenemos el hero por pueblo
            }
          });

        // ✅ Cargar establecimientos filtrados
        this.api.loadEstablecimientosByTownAndTipoId(this.townSlug, this.idTipo);
      });
  }

  ngOnDestroy(): void {
    this.stopHero();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =========================
  // HERO helpers
  // =========================
  private setHeroFallback() {
    this.heroImgs = [];
    this.heroIndex = 0;
    this.stopHero();
  }

  // =========================
  // HERO por PUEBLO (townSlug)
  // =========================
  private setHeroByTownSlug(townSlug: string) {
    const t = (townSlug || '').toLowerCase().trim();

    if (t === 'filandia') {
      this.heroImgs = [
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765722321/filandia_portada_-_carrucel_yvkncf.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1770646756/imagen6valle-cocora_r8sw92.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765719559/Salento_Portada-_carrucel_xhjred.jpg'
      ];
    } else if (t === 'salento') {
      this.heroImgs = [
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765732081/cabalgata_portada_-_5_xjw3xq.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729542/portada_8_jrmbd6.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731463/cabalgata_-_portada_4_dma1bo.jpg'
      ];
    } else {
      // fallback por pueblo desconocido
      this.setHeroFallback();
      return;
    }

    this.heroIndex = 0;
    this.startHero();
  }

  private startHero() {
    this.stopHero();
    if (!this.heroImgs.length) return;

    this.heroTimerId = setInterval(() => {
      this.heroIndex = (this.heroIndex + 1) % this.heroImgs.length;
    }, 3500);
  }

  private stopHero() {
    if (this.heroTimerId) clearInterval(this.heroTimerId);
    this.heroTimerId = null;
  }

  // =========================
  // Search + navigation
  // =========================
  onSearch() {
    this.filtered = this.applySearch(this.query);
  }

  private applySearch(query: string): CardItem[] {
    const q = (query ?? '').trim().toLowerCase();
    return !q
      ? [...this.items]
      : this.items.filter(x => x.titulo.toLowerCase().includes(q));
  }

  openItem(item: CardItem) {
    this.router.navigate(['/detalles', item.slug]);
  }
}