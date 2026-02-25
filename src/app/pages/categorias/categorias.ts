import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { SearchService, SearchResult } from '../../service/search.service';
import { CATEGORIAS_DATA, CategoriaData } from '../../data/categorias.data';
import { Api } from '../../api';
import { portadaTipo } from '../../shared/tipos-portada';

type TipoItem = {
  id_tipo: number;
  nombre_tipo: string;
};

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Nav, Footer],
  templateUrl: './categorias.html',
  styleUrls: ['./categorias.css']
})
export class Categorias implements OnInit, OnDestroy {


  portadaTipo = portadaTipo;
  //  ahora el slug viene como townSlug
  townSlug = '';

  query = '';
  results: SearchResult[] = [];
  showPanel = false;

  //  seguimos usando data estática SOLO para slider/itinerarios del pueblo
  data?: CategoriaData;

  //  tipos dinámicos del backend
  tipos: TipoItem[] = [];
  loadingTipos = false;

  private timerId: any = null;
  private slideIndex = 0;
  showA = true;

  leftA = '';
  leftB = '';
  rightA = '';
  rightB = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private search: SearchService,
    private api: Api
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.townSlug = params.get('townSlug') || '';

      //  data estática (solo estética: slider/itinerarios)
      this.data = CATEGORIAS_DATA[this.townSlug] ?? {
        nombre: this.townSlug || 'Destino',
        sliderImgs: [],
        categorias: [],
        itinerarios: []
      };

      this.ensureFallbacks();
      this.startAutoSlider();

      //  cargar tipos reales del backend (lo importante)
      this.cargarTipos();
    });
  }

  ngOnDestroy(): void {
    this.stopAutoSlider();
  }

  private cargarTipos() {
    if (!this.townSlug) {
      this.tipos = [];
      return;
    }

    this.loadingTipos = true;
    this.api.getTiposByTown(this.townSlug).subscribe({
      next: (data: any[]) => {
        // backend devuelve: [{ id_tipo, nombre_tipo }]
        this.tipos = (data ?? []).map(x => ({
          id_tipo: Number(x.id_tipo),
          nombre_tipo: String(x.nombre_tipo ?? '')
        }));
        this.loadingTipos = false;
      },
      error: () => {
        this.tipos = [];
        this.loadingTipos = false;
      }
    });
  }

  private ensureFallbacks() {
    const imgs = this.data?.sliderImgs ?? [];
    const fallback = 'https://via.placeholder.com/900x500?text=SLIDE';

    if (!imgs.length) {
      this.leftA = fallback; this.leftB = fallback;
      this.rightA = fallback; this.rightB = fallback;
      return;
    }

    this.slideIndex = 0;
    this.showA = true;

    this.leftA = imgs[0] ?? fallback;
    this.rightA = imgs[1] ?? imgs[0] ?? fallback;

    this.leftB = imgs[2] ?? imgs[0] ?? fallback;
    this.rightB = imgs[3] ?? imgs[1] ?? imgs[0] ?? fallback;
  }

  private startAutoSlider() {
    this.stopAutoSlider();
    const imgs = this.data?.sliderImgs ?? [];
    if (imgs.length <= 1) return;

    this.timerId = setInterval(() => {
      this.slideIndex = (this.slideIndex + 2) % imgs.length;

      const nextLeft = imgs[this.slideIndex] ?? imgs[0];
      const nextRight = imgs[(this.slideIndex + 1) % imgs.length] ?? imgs[0];

      if (this.showA) {
        this.leftB = nextLeft;
        this.rightB = nextRight;
      } else {
        this.leftA = nextLeft;
        this.rightA = nextRight;
      }

      this.showA = !this.showA;
    }, 3000);
  }

  private stopAutoSlider() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  onSearch() {
    const q = this.query.trim();
    if (!q) {
      this.results = [];
      this.showPanel = false;
      return;
    }

    // ✅ busca dentro del pueblo actual
    this.results = this.search.search(q, 12, { townSlug: this.townSlug });
    this.showPanel = true;
  }

  goResult(r: SearchResult) {
    this.showPanel = false;
    this.query = '';

    if (r.kind === 'lugar') {
      this.router.navigate(['/detalles', r.route[1] ?? r.route]);
      return;
    }

    this.router.navigate(r.route);
  }

  closePanel() {
    this.showPanel = false;
  }

  
  // ✅ ahora: entrar a un TIPO real por id
  goTipo(idTipo: number) {
    this.router.navigate(['/lugares', this.townSlug, 'tipo', idTipo]);
  }

  goItinerary(index: number) {
    const it = this.data?.itinerarios?.[index];
    console.log('Click itinerario:', index + 1, it?.titulo, 'en', this.townSlug);
  }
}