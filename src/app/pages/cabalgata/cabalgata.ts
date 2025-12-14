import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


type CardItem = {
  titulo: string;
  img: string;
  lugar?: string;
};


@Component({
  selector: 'app-cabalgata',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Nav, Footer],
  templateUrl: './cabalgata.html',
  styleUrl: './cabalgata.css'
})
export class Cabalgata {

  query = '';
  slug = '';

  // ✅ aquí pones tus imágenes reales
  heroImgs: string[] = [
    'IMG_HERO_1',
    'IMG_HERO_2',
    'IMG_HERO_3',
    'IMG_HERO_4',
  ];

  private timerId: any = null;
  heroIndex = 0;

  // Cards (tu data)
  items: CardItem[] = [
    { titulo: 'Valle del Cocora', img: 'IMG_CARD_1' },
    { titulo: 'Ruta de Miradores', img: 'IMG_CARD_2' },
    { titulo: 'Atardecer en Montaña', img: 'IMG_CARD_3' },
    { titulo: 'Cabalgata Familiar', img: 'IMG_CARD_4' },
    { titulo: 'Café + Caballo', img: 'IMG_CARD_5' },
    { titulo: 'Ruta Río Quindío', img: 'IMG_CARD_6' },
  ];

  filtered: CardItem[] = [...this.items];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') || '';
    });

    this.startHero();
  }

  ngOnDestroy(): void {
    this.stopHero();
  }

  get currentHeroImg(): string {
    if (!this.heroImgs.length) return 'https://via.placeholder.com/1400x500?text=HERO';
    return this.heroImgs[this.heroIndex % this.heroImgs.length];
  }

  private startHero() {
    this.stopHero();
    if (this.heroImgs.length <= 1) return;

    this.timerId = setInterval(() => {
      this.heroIndex = (this.heroIndex + 1) % this.heroImgs.length;
    }, 1000); // ✅ 1 segundo
  }

  private stopHero() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  onSearch() {
    const q = this.query.trim().toLowerCase();
    this.filtered = !q
      ? [...this.items]
      : this.items.filter(x => x.titulo.toLowerCase().includes(q));
  }

  openItem(item: CardItem) {
    console.log('Abrir detalle:', item);
  }
}
