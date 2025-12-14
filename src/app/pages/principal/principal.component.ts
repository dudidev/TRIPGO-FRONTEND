import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
// import { Api } from '../../api'; 

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    Nav,
    Footer
  ],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
  ) {}

  // ==========================
  // BUSCADOR
  // ==========================
  query: string = '';

  onSearch() {
    console.log('Buscando:', this.query);
  }

  goToTown(slug: string) {
    this.router.navigate(['/categorias', slug]);
  }

  // ==========================
  // HERO SLIDER (FADE SUAVE)
  // ==========================
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

  heroA: string = '';
  heroB: string = '';
  showA: boolean = true;

  private heroIndex = 0;
  private heroTimerId: any = null;

  // ==========================
  // DATA DESDE BACKEND
  // ==========================
  // loadingTowns: boolean = false;
  // errorTowns: string | null = null;
  // towns: any[] = [];

  // ==========================
  // LIFECYCLE
  // ==========================
  ngOnInit(): void {
    // --- HERO INIT ---
    if (this.heroImages.length) {
      this.heroA = this.heroImages[0];
      this.heroB = this.heroImages[1] ?? this.heroImages[0];
      this.heroIndex = 1;
    }
    this.startHeroSlider();

    // this.loadTowns();
    
  }

  ngOnDestroy(): void {
    this.stopHeroSlider();
  }

  // ==========================
  // HERO LOGIC
  // ==========================
  private startHeroSlider() {
    this.stopHeroSlider();
    if (this.heroImages.length <= 1) return;

    this.heroTimerId = setInterval(() => {
      this.heroIndex = (this.heroIndex + 1) % this.heroImages.length;

      if (this.showA) {
        this.heroB = this.heroImages[this.heroIndex];
      } else {
        this.heroA = this.heroImages[this.heroIndex];
      }

      this.showA = !this.showA;
    }, 3000);
  }

  private stopHeroSlider() {
    if (this.heroTimerId) {
      clearInterval(this.heroTimerId);
      this.heroTimerId = null;
    }
  }
}

  // ==========================
  // API CALL
  // ==========================
//   private loadTowns() {
//     this.loadingTowns = true;
//     this.errorTowns = null;

//     this.api.getUbicaciones().subscribe({
//       next: (data) => {
//         this.towns = data;
//         this.loadingTowns = false;
//       },
//       error: (err) => {
//         console.error(err);
//         this.errorTowns = 'No se pudieron cargar los lugares';
//         this.loadingTowns = false;
//       }
//     });
//   }
// }
