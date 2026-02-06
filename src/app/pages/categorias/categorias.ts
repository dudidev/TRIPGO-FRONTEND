import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';

type CategoriaItem = { key: string; label: string; img: string };
type ItinerarioItem = { titulo: string; img: string };

type CategoriaData = {
  nombre: string;
  sliderImgs: string[];
  categorias: CategoriaItem[];
  itinerarios: ItinerarioItem[];
};

const CATEGORIAS_DATA: Record<string, CategoriaData> = {
  salento: {
    nombre: 'Salento',
    sliderImgs: [
      "https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729535/portada_-_categorias_ooyums.jpg",
      "https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729647/portada_-_categorias_2_zpvmbp.jpg",
      "https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729531/portada_-_categoria_5_ulppr2.jpg",
      "https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729542/portada_8_jrmbd6.jpg",
      "https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729543/portada_9_ulkcgh.jpg",
      "https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729538/portada_6_lbjntm.jpg",
      "https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729528/portada_-_categoria_3_sl5x04.jpg",
      "https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729524/portaa_-_categorias_4_isekut.jpg"
    ],
    categorias: [
      { key: 'valle-cocora', label: 'Valle del Cocora', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729518/cocora_3_blygia.jpg' },
      { key: 'senderismo', label: 'Senderismo', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729551/senderismo_-_categorias_sqngzv.jpg' },
      { key: 'cabalgatas', label: 'Cabalgatas', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729510/cabalgata_-_categorias_lzojcq.jpg' },

      { key: 'miradores', label: 'Miradores', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729523/mirador_-_categoria_omagyv.jpg' },
      { key: 'cafe-tour', label: 'Tour de Café', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729552/tour_cafe_-_categoria_be5nev.jpg' },
      { key: 'calle-real', label: 'Calle Real', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729515/calle_real_-_categoria_hudaar.jpg' },

      { key: 'cafes', label: 'Cafés', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729512/cafes_-_categorias_f9s1db.jpg' },
      { key: 'restaurantes', label: 'Restaurantes', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729548/restaurante_-_categoria_prasz2.jpg' },
      { key: 'bares', label: 'Bares', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729507/bares_-_categorias_drm5rl.jpg' },

      { key: 'artesanias', label: 'Artesanías', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729506/artesanias_-_categorias_cmhfdw.jpg' },
      { key: 'avistamiento-aves', label: 'Avistamiento de aves', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765725175/avistamento_aves_portada_-_suge_kpizdw.jpg' },
      { key: 'jeep-willys', label: 'Jeep Willys', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729520/Jeep_Willys_-_categorias_sarw7o.jpg' },
    ],
    itinerarios: [
      { titulo: 'Aventura entre palmas y colores', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729518/cocora_3_blygia.jpg' },
      { titulo: 'Naturaleza en el Valle de Cocora', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685157/salento_1-portada_zkh8fr.jpg' },
      { titulo: 'Miradores + atardecer', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765722352/Colombia_a5gesq.jpg' },
      { titulo: 'Ruta de café y cata', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729552/tour_cafe_-_categoria_be5nev.jpg' },
      { titulo: 'Calle Real + artesanías', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729515/calle_real_-_categoria_hudaar.jpg' },
      { titulo: 'Cabalgata por senderos', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733201/portada_-_categoria_5_t7pmpz.jpg' },
      { titulo: 'Avistamiento de aves temprano', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765725175/avistamento_aves_portada_-_suge_kpizdw.jpg' },
      { titulo: 'Gastronomía típica del Quindío', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729535/portada_-_categorias_ooyums.jpg' },
      { titulo: 'Plan relax: cafés y fotos', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729523/mirador_-_categoria_omagyv.jpg' },
    ]
  },

  filandia: {
    nombre: 'Filandia',
    sliderImgs: [
      'https://via.placeholder.com/900x500?text=FILANDIA+1',
      'https://via.placeholder.com/900x500?text=FILANDIA+2',
      'https://via.placeholder.com/900x500?text=FILANDIA+3',
      'https://via.placeholder.com/900x500?text=FILANDIA+4'
    ],
    categorias: [
      { key: 'miradores', label: 'Miradores', img: 'https://via.placeholder.com/600x400?text=MIRADORES' },
      { key: 'cafes', label: 'Cafés', img: 'https://via.placeholder.com/600x400?text=CAFES' },
      { key: 'artesanias', label: 'Artesanías', img: 'https://via.placeholder.com/600x400?text=ARTESANIAS' },
      { key: 'cultura', label: 'Cultura', img: 'https://via.placeholder.com/600x400?text=CULTURA' },
      { key: 'cultura', label: 'Cultura', img: 'https://via.placeholder.com/600x400?text=CULTURA' },
      { key: 'paseo', label: 'Paseo', img: 'https://via.placeholder.com/600x400?text=PASEO' },


    ],
    itinerarios: [
      { titulo: 'Ruta cultural', img: 'https://via.placeholder.com/80?text=1' },
      { titulo: 'Mirador + fotografía', img: 'https://via.placeholder.com/80?text=2' },
      { titulo: 'Plan cafetero', img: 'https://via.placeholder.com/80?text=3' },
      { titulo: 'Plan relax: cafés y fotos', img: 'https://via.placeholder.com/80?text=4' },

    ]
  }
};

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
  data?: CategoriaData;

  //  Slider suave A/B (para fade)
  private timerId: any = null;
  private slideIndex = 0;
  showA = true;

  leftA = '';
  leftB = '';
  rightA = '';
  rightB = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') || '';
      this.data = CATEGORIAS_DATA[this.slug] ?? {
        nombre: this.slug || 'Destino',
        sliderImgs: [],
        categorias: [],
        itinerarios: []
      };

      //  prepara capas y arranca slider suave
      this.ensureFallbacks();
      this.startAutoSlider();
    });
  }

  ngOnDestroy(): void {
    this.stopAutoSlider();
  }

  //  Inicializa imágenes A/B para izquierda y derecha
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

    // A visible
    this.leftA = imgs[0] ?? fallback;
    this.rightA = imgs[1] ?? imgs[0] ?? fallback;

    // B pre-cargada
    this.leftB = imgs[2] ?? imgs[0] ?? fallback;
    this.rightB = imgs[3] ?? imgs[1] ?? imgs[0] ?? fallback;
  }

  private startAutoSlider() {
    this.stopAutoSlider();
    const imgs = this.data?.sliderImgs ?? [];
    if (imgs.length <= 1) return;

    //  más suave que 1s (puedes moverlo a 4000 o 4500 si quieres aún más calmado)
    this.timerId = setInterval(() => {
      // avanzamos 2 para mantener pareja izquierda/derecha
      this.slideIndex = (this.slideIndex + 2) % imgs.length;

      const nextLeft = imgs[this.slideIndex] ?? imgs[0];
      const nextRight = imgs[(this.slideIndex + 1) % imgs.length] ?? imgs[0];

      // preparamos la capa que NO está visible
      if (this.showA) {
        this.leftB = nextLeft;
        this.rightB = nextRight;
      } else {
        this.leftA = nextLeft;
        this.rightA = nextRight;
      }

      // dispara el fade
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
    console.log('Buscar:', this.query, 'en', this.slug);
    // futuro: backend sugerencias + popup
  }

  goCategory(catKey: string) {
  this.router.navigate(['/lugares', this.slug, catKey]);
}


  goItinerary(index: number) {
    const it = this.data?.itinerarios?.[index];

    console.log(
      'Click itinerario:',
      index + 1,
      it?.titulo,
      'en',
      this.slug
    );
  }
}
