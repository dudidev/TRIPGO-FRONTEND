import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { Api } from '../../api';

type CardItem = {
  slug: string;
  titulo: string;
  img: string;
};

type LugaresData = {
  titulo: string;
  heroImgs: string[];
  items: CardItem[];
};

const LUGARES_DATA: Record<string, Record<string, LugaresData>> = {
  // (tu data estática igual)
  salento: {
    cabalgatas: { titulo: 'Cabalgatas', heroImgs: [/* ... */], items: [] },
    'valle-cocora': { titulo: 'Valle del Cocora', heroImgs: [/* ... */], items: [] },
    senderismo: { titulo: 'Senderismo', heroImgs: [/* ... */], items: [] },
    miradores: { titulo: 'Miradores', heroImgs: [/* ... */], items: [] },
  },
  filandia: {
    miradores: { titulo: 'Miradores', heroImgs: [/* ... */], items: [] }
  }
};

@Component({
  selector: 'app-lugares',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Nav, Footer],
  templateUrl: './lugares.html',
  styleUrl: './lugares.css'
})
export class LugaresComponent {
  query = '';

  townSlug = '';
  categoryKey = '';

  titulo = '';
  heroImgs: string[] = [];

  items: CardItem[] = [];
  filtered: CardItem[] = [];

  heroIndex = 0;
  private timerId: any = null;

  loading = false;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: Api
  ) {}

  ngOnInit(): void {
    console.log('✅ LugaresComponent.ngOnInit ejecutado');

    // 1) Suscribirse UNA sola vez al estado global
    this.api.establecimientos$.subscribe({
      next: (data: any[]) => {
        this.items = (data ?? []).map((e: any) => ({
          slug: String(e.id_establecimiento ?? e.id ?? 'sin-id'),
          titulo: e.nombre_establecimiento ?? e.nombre ?? e.direccion ?? 'Sin nombre',
          img: e.imagen ?? 'https://via.placeholder.com/600x400?text=Establecimiento'
        }));

        this.filtered = this.applySearch(this.query);
        this.loading = false;
        this.errorMsg = '';
      },
      error: () => {
        this.items = [];
        this.filtered = [];
        this.loading = false;
        this.errorMsg = 'Error cargando establecimientos';
      }
    });

    // 2) Cambios por ruta: actualiza hero/titulo y trae establecimientos filtrados
    this.route.paramMap.subscribe(params => {
      this.townSlug = params.get('townSlug') || '';
      this.categoryKey = params.get('categoryKey') || '';

      const data = LUGARES_DATA[this.townSlug]?.[this.categoryKey];

      if (!data) {
        this.titulo = 'No hay lugares para esta categoría aún';
        this.heroImgs = [];
        this.stopHero();
      } else {
        this.titulo = data.titulo;
        this.heroImgs = data.heroImgs;

        this.heroIndex = 0;
        this.startHero();
      }

      // ✅ CAMBIO CLAVE: NO traer todo. Traer filtrado.
      this.loading = true;
      this.errorMsg = '';
      this.items = [];
      this.filtered = [];

      this.api.loadEstablecimientosByTownAndCategory(this.townSlug, this.categoryKey);
    });
  }

  ngOnDestroy(): void {
    this.stopHero();
  }

  private stopHero() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = null;
  }

  startHero() {
    this.stopHero();
    if (!this.heroImgs.length) return;

    this.timerId = setInterval(() => {
      this.heroIndex = (this.heroIndex + 1) % this.heroImgs.length;
    }, 3500);
  }

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