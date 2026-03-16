import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { SearchService, SearchResult } from '../../service/search.service';
import { Api } from '../../api';

import { take } from 'rxjs';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Nav, Footer],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit, OnDestroy {

  query     : string        = '';
  results   : SearchResult[] = [];
  showPanel : boolean        = false;

  heroImages: string[] = [
    'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685155/Parque_del_cafe_2-portada_d35goj.jpg',
    'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685143/filandia_1-portada_tu13tg.jpg',
    'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685144/Glamping_1-portada_alkogk.jpg',
    'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685156/parque_del_cafe3-portada_zhiusk.jpg',
    'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685143/gastronomia_1-portada_pge8wh.jpg',
    'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685157/salento_1-portada_zkh8fr.jpg',
    'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685143/gastronomia_2-portada_e7tr5m.jpg',
    'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685154/Img_Parque_del_cafe_ruzil0.jpg',
  ];

  heroA     : string  = '';
  heroB     : string  = '';
  showA     : boolean = true;
  private heroIndex   = 0;
  private heroTimerId : any = null;

  constructor(
    private router : Router,
    private search : SearchService,
    private api    : Api
  ) {}

  ngOnInit(): void {
    // ── Hero slider ──────────────────────────────
    if (this.heroImages.length) {
      this.heroA     = this.heroImages[0];
      this.heroB     = this.heroImages[1] ?? this.heroImages[0];
      this.heroIndex = 1;
    }
    this.startHeroSlider();

    // ── Índice de búsqueda (tipos + establecimientos) ──
    this.api.getTipos().pipe(take(1)).subscribe({
      next: (respTipos: any) => {
        const tipos = Array.isArray(respTipos) ? respTipos : (respTipos?.data ?? []);

        this.api.establecimientos$.pipe(take(1)).subscribe({
          next: (lista: any[]) => {
            if (Array.isArray(lista) && lista.length) {
              this.search.setFromBackend(lista, tipos);
              return;
            }
            this.loadEstablecimientos(tipos);
          },
          error: () => this.loadEstablecimientos(tipos)
        });
      },
      error: () => {
        this.loadEstablecimientos([]);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopHeroSlider();
    // document.body.style.overflow = '';
  }

  // ── Búsqueda desde input ──────────────────────
  onSearch(): void {
    const q = this.query.trim();
    if (!q) {
      this.results   = [];
      this.showPanel = false;
      return;
    }
    this.results   = this.search.search(q, 12);
    this.showPanel = true;
    // document.body.style.overflow = 'hidden';
  }

  // ── Búsqueda rápida desde tags / categorías ───
  quickSearch(term: string): void {
    this.query   = term;
    this.results = this.search.search(term, 12);
    this.showPanel = true;
    // document.body.style.overflow = 'hidden';
  }

  goResult(r: SearchResult): void {
    this.showPanel = false;
    // document.body.style.overflow = 'hidden';
    this.query     = '';

    if (r.kind === 'categoria') {
      const town = r.townSlug;
      const tipo = r.tipoId;
      if (town && tipo != null) {
        this.router.navigate(['/lugares', town], { queryParams: { tipo } });
        return;
      }
    }

    this.router.navigate(r.route);
  }

  closePanel(): void {
    this.showPanel = false;
    // document.body.style.overflow = 'hidden';
  }

  goToTown(slug: string): void {
    this.router.navigate(['/lugares', slug]);
  }

  // ── Hero slider ───────────────────────────────
  private startHeroSlider(): void {
    this.stopHeroSlider();
    if (this.heroImages.length <= 1) return;

    this.heroTimerId = setInterval(() => {
      this.heroIndex = (this.heroIndex + 1) % this.heroImages.length;
      if (this.showA) this.heroB = this.heroImages[this.heroIndex];
      else            this.heroA = this.heroImages[this.heroIndex];
      this.showA = !this.showA;
    }, 3500);
  }

  private stopHeroSlider(): void {
    if (this.heroTimerId) {
      clearInterval(this.heroTimerId);
      this.heroTimerId = null;
    }
  }

  // ── Helper para cargar establecimientos ───────
  private loadEstablecimientos(tipos: any[]): void {
    this.api.getEstablecimientos().pipe(take(1)).subscribe({
      next: (respEst: any) => {
        const est = Array.isArray(respEst) ? respEst : (respEst?.data ?? respEst ?? []);
        this.search.setFromBackend(est, tipos);
      },
      error: (err) => {
        console.error('No se pudieron cargar establecimientos:', err);
        this.search.setFromBackend([], tipos);
      }
    });
  }
}
