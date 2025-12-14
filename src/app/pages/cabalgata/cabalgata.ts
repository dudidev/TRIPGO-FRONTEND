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

  //  imágenes portada
  heroImgs: string[] = [
    'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731482/cabalgata_portada_-_cabal_sd9xro.jpg',
    'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731467/cabalgata_portada_2-_cabal_vkqbmf.jpg',
    'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731481/cabalgata_portada_-_5_xfwmcd.jpg',
    'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765732072/cabalgata_portada_-_3_sysznh.jpg',
    'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731463/cabalgata_-_portada_4_dma1bo.jpg',
  ];

  private timerId: any = null;
  heroIndex = 0;

  // Cards (tu data)
  items: CardItem[] = [
    { titulo: 'Cabalgatas San Pablo', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733179/san_pablo_-_cabalgata_rio_igrhyg.jpg' },
    { titulo: 'Cabalgatas Caminos Y Trochas', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733201/portada_-_categoria_5_t7pmpz.jpg' },
    { titulo: 'Alquiler De Caballos Salento', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733119/alquiler_de_caballos_jxigjm.jpg' },
    { titulo: 'Parque El Secreto', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733591/parque_el_secreto_2_dxc2be.jpg' },
    { titulo: 'Operadora Turistica Equitou', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733157/operadora_-_equiotur_iruxok.jpg' },
    { titulo: 'Amigos Caballiztas De Salento', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733124/amigos_caballiztas_wmm1yd.jpg' },
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
    }, 3500); // 
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
