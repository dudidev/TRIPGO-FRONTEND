import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';

type CardItem = {
  slug: string;
  titulo: string;
  img: string;
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

  heroImgs: string[] = [
    'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731482/cabalgata_portada_-_cabal_sd9xro.jpg',
    'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731467/cabalgata_portada_2-_cabal_vkqbmf.jpg',
    'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731481/cabalgata_portada_-_5_xfwmcd.jpg',
    'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765732072/cabalgata_portada_-_3_sysznh.jpg',
    'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731463/cabalgata_-_portada_4_dma1bo.jpg',
  ];

  heroIndex = 0;
  private timerId: any = null;

  items: CardItem[] = [
    {
      slug: 'cabalgatas-san-pablo',
      titulo: 'Cabalgatas San Pablo',
      img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733179/san_pablo_-_cabalgata_rio_igrhyg.jpg'
    },
    {
      slug: 'caminos-y-trochas',
      titulo: 'Cabalgatas Caminos Y Trochas',
      img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733201/portada_-_categoria_5_t7pmpz.jpg'
    },
    {
      slug: 'alquiler-caballos-salento',
      titulo: 'Alquiler De Caballos Salento',
      img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733119/alquiler_de_caballos_jxigjm.jpg'
    },
    {
      slug: 'parque-el-secreto',
      titulo: 'Parque El Secreto',
      img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733591/parque_el_secreto_2_dxc2be.jpg'
    },
    {
      slug: 'equitour',
      titulo: 'Operadora Turistica Equitou',
      img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733157/operadora_-_equiotur_iruxok.jpg'
    },
    {
      slug: 'amigos-caballistas',
      titulo: 'Amigos Caballiztas De Salento',
      img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733124/amigos_caballiztas_wmm1yd.jpg'
    }
  ];

  filtered: CardItem[] = [...this.items];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') || '';
    });

    this.startHero();
  }

  ngOnDestroy(): void {
    if (this.timerId) clearInterval(this.timerId);
  }

  startHero() {
    this.timerId = setInterval(() => {
      this.heroIndex = (this.heroIndex + 1) % this.heroImgs.length;
    }, 3500);
  }

  onSearch() {
    const q = this.query.trim().toLowerCase();
    this.filtered = !q
      ? [...this.items]
      : this.items.filter(x => x.titulo.toLowerCase().includes(q));
  }

  // 👉 NAVEGACIÓN FUNCIONAL
  openItem(item: CardItem) {
    this.router.navigate(['/detalles', item.slug]);
  }
}
