import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { Router } from '@angular/router';





@Component({
  selector: 'app-principal',
  standalone: true, // ✅ ESTO ES CLAVE
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
  constructor(private router: Router) {}

  //  BUSCADOR
  query: string = '';

  onSearch() {
    console.log('Buscando:', this.query);
  }

  goToTown(slug: string) {
    this.router.navigate(['/categorias', slug]);
  }

  //  SLIDER HERO
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

  currentHero: string = this.heroImages[0];
  private heroIndex = 0;
  private heroTimerId: any = null;

  ngOnInit(): void {
    this.startHeroSlider();
  }

  ngOnDestroy(): void {
    this.stopHeroSlider();
  }

  private startHeroSlider() {
    this.stopHeroSlider();

    if (this.heroImages.length <= 1) return;

    this.heroTimerId = setInterval(() => {
      this.heroIndex = (this.heroIndex + 1) % this.heroImages.length;
      this.currentHero = this.heroImages[this.heroIndex];
    }, 3000);
  }

  private stopHeroSlider() {
    if (this.heroTimerId) {
      clearInterval(this.heroTimerId);
      this.heroTimerId = null;
    }
  }
}
