import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { Api } from '../../api';
import { Subject, takeUntil } from 'rxjs';

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
              // opcional: puedes armar hero dinámico por tipo
              this.setHeroByTipoNombre(nombre);
            },
            error: () => {
              this.titulo = `Establecimientos en ${this.townSlug}`;
              this.setHeroFallback();
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

  private setHeroByTipoNombre(nombre: string) {
    // ✅ Sin quemar datos de BD: solo estética
    const n = (nombre || '').toLowerCase();

    if (n.includes('cabalg')) {
      this.heroImgs = [
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731482/cabalgata_portada_-_cabal_sd9xro.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731467/cabalgata_portada_2-_cabal_vkqbmf.jpg'
      ];
    } else if (n.includes('mirador')) {
      this.heroImgs = [
        'https://via.placeholder.com/1400x500?text=Miradores+1',
        'https://via.placeholder.com/1400x500?text=Miradores+2'
      ];
    } else {
      // default
      this.heroImgs = [];
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