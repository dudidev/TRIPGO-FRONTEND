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


type LugaresData = {
  titulo: string;      
  heroImgs: string[];
  items: CardItem[];
};

const LUGARES_DATA: Record<string, Record<string, LugaresData>> = {
  salento: {
    cabalgatas: {
      titulo: 'Cabalgatas',
      heroImgs: [
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731482/cabalgata_portada_-_cabal_sd9xro.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731467/cabalgata_portada_2-_cabal_vkqbmf.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731481/cabalgata_portada_-_5_xfwmcd.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765732072/cabalgata_portada_-_3_sysznh.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731463/cabalgata_-_portada_4_dma1bo.jpg',
      ],
      items: [
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
      ]
    },

   
    'valle-cocora': {
      titulo: 'Valle del Cocora',
      heroImgs: [
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729518/cocora_3_blygia.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685157/salento_1-portada_zkh8fr.jpg',
      ],
      items: [
        {
          slug: 'COCORATOURS1',
          titulo: 'CocoraTours - Excursión grupal valle del cocora',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1770644290/Imagen2valle-cocora_w9b3ja.png'
        }, 
        {
          slug: 'COCORATOURS2',
          titulo: 'CocoraTours - Plan con hospedaje palmas Carbonera',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1770644278/img1valle-cocora_azfhwk.png'
        },
        {
          slug: 'COCORA XTREME',
          titulo: 'Cocora Xtreme',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1770644280/Imagen4valle-cocora_q54j6k.png'
        },
        {
          slug: 'Bosques De Cocora Donde Juanb',
          titulo: 'Bosques De Cocora Donde Juanb',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1770644269/Imagen3valle-cocora_w0ggkc.png'
        }
      ]
    },

    "senderismo": {
      titulo: 'Senderismo',
      heroImgs: [
        'https://via.placeholder.com/900x500?text=Senderismo+1',],
      items: [
        {
          slug: 'sendero-los-pinos',
          titulo: 'Sendero Los Pinos',
          img: 'https://via.placeholder.com/600x400?text=Sendero+Los+Pinos'
        },
        {
          slug: 'sendero-los-montes',
          titulo: 'Sendero Los Montes',
          img: 'https://via.placeholder.com/600x400?text=Sendero+Los+Montes'
        }
      ]
    },

    "miradores": {
      titulo: 'Miradores',
      heroImgs: [
        'https://via.placeholder.com/900x500?text=Miradores+1',],
      items: [
        {
          slug: 'mirador-colina-iluminada',
          titulo: 'Mirador Colina Iluminada',
          img: 'https://via.placeholder.com/600x400?text=Mirador+Colina+Iluminada'
        },
        {
          slug: 'mirador-colina-iluminada',
          titulo: 'Mirador Colina Iluminada',
          img: 'https://via.placeholder.com/600x400?text=Mirador+Colina+Iluminada'
        },
        {
          slug: 'mirador-colina-iluminada',
          titulo: 'Mirador Colina Iluminada',
          img: 'https://via.placeholder.com/600x400?text=Mirador+Colina+Iluminada'
        }
      ]
  },
},
  filandia: {
    miradores: {
      titulo: 'Miradores',
      heroImgs: [
        'https://via.placeholder.com/900x500?text=FILANDIA+MIRADORES+1',
        'https://via.placeholder.com/900x500?text=FILANDIA+MIRADORES+2',
      ],
      items: [
        {
          slug: 'mirador-encanto',
          titulo: 'Mirador Encanto',
          img: 'https://via.placeholder.com/600x400?text=Mirador+Encanto'
        }
      ]
    }
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

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
     
      this.townSlug = params.get('townSlug') || '';
      this.categoryKey = params.get('categoryKey') || '';

      const data = LUGARES_DATA[this.townSlug]?.[this.categoryKey];

     
      if (!data) {
        this.titulo = 'No hay lugares para esta categoría aún';
        this.heroImgs = [];
        this.items = [];
        this.filtered = [];
        this.stopHero();
        return;
      }

      this.titulo = data.titulo;
      this.heroImgs = data.heroImgs;
      this.items = data.items;
      this.filtered = [...this.items];

      // reinicia slider
      this.heroIndex = 0;
      this.startHero();
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
    const q = this.query.trim().toLowerCase();
    this.filtered = !q
      ? [...this.items]
      : this.items.filter(x => x.titulo.toLowerCase().includes(q));
  }

  // NAVEGACIÓN FUNCIONAL
  openItem(item: CardItem) {
    this.router.navigate(['/detalles', item.slug]);
  }
}
