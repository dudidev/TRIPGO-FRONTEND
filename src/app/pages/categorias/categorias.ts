import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { SearchService, SearchResult } from '../../service/search.service';
import { CATEGORIAS_DATA, CategoriaData } from '../../data/categorias.data';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Nav, Footer],
  templateUrl: './categorias.html',
  styleUrls: ['./categorias.css']
})
export class Categorias implements OnInit, OnDestroy {
  slug = '';
  query = '';
  results: SearchResult[] = [];
  showPanel = false;
  data?: CategoriaData;

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
    private search: SearchService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') || '';
      this.data = CATEGORIAS_DATA[this.slug] ?? {
        nombre: this.slug || 'Destino',
        sliderImgs: [],
        categorias: [],
        itinerarios: []
      };

      this.ensureFallbacks();
      this.startAutoSlider();
    });
  }

  ngOnDestroy(): void {
    this.stopAutoSlider();
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

  // ✅ SOLO busca dentro del pueblo actual (slug)
  this.results = this.search.search(q, 12, { townSlug: this.slug });
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


  goCategory(catKey: string) {
    this.router.navigate(['/lugares', this.slug, catKey]);
  }

  goItinerary(index: number) {
    const it = this.data?.itinerarios?.[index];
    console.log('Click itinerario:', index + 1, it?.titulo, 'en', this.slug);
  }
}
