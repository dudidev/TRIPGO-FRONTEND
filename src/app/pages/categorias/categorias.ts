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
    // Pon aquí tus 6-10 imágenes reales para que el slider rote bonito
    sliderImgs: [
      'https://via.placeholder.com/900x500?text=SALENTO+1',
      'https://via.placeholder.com/900x500?text=SALENTO+2',
      'https://via.placeholder.com/900x500?text=SALENTO+3',
      'https://via.placeholder.com/900x500?text=SALENTO+4',
      'https://via.placeholder.com/900x500?text=SALENTO+5',
      'https://via.placeholder.com/900x500?text=SALENTO+6'
    ],
    //  Más categorías (experiencias reales típicas en Salento)
    categorias: [
      { key: 'valle-cocora', label: 'Valle del Cocora', img: 'https://via.placeholder.com/600x400?text=COCORA' },
      { key: 'senderismo', label: 'Senderismo', img: 'https://via.placeholder.com/600x400?text=SENDERISMO' },
      { key: 'cabalgatas', label: 'Cabalgatas', img: 'https://via.placeholder.com/600x400?text=CABALGATAS' },

      { key: 'miradores', label: 'Miradores', img: 'https://via.placeholder.com/600x400?text=MIRADORES' },
      { key: 'cafe-tour', label: 'Tour de Café', img: 'https://via.placeholder.com/600x400?text=CAFE+TOUR' },
      { key: 'calle-real', label: 'Calle Real', img: 'https://via.placeholder.com/600x400?text=CALLE+REAL' },

      { key: 'cafes', label: 'Cafés', img: 'https://via.placeholder.com/600x400?text=CAFES' },
      { key: 'restaurantes', label: 'Restaurantes', img: 'https://via.placeholder.com/600x400?text=RESTAURANTES' },
      { key: 'bares', label: 'Bares', img: 'https://via.placeholder.com/600x400?text=BARES' },

      { key: 'artesanias', label: 'Artesanías', img: 'https://via.placeholder.com/600x400?text=ARTESANIAS' },
      { key: 'avistamiento-aves', label: 'Avistamiento de aves', img: 'https://via.placeholder.com/600x400?text=AVES' },
      { key: 'jeep-willys', label: 'Jeep Willys', img: 'https://via.placeholder.com/600x400?text=JEEP+WILLYS' },
    ],
    //  Itinerario 
    itinerarios: [
      { titulo: 'Aventura entre palmas y colores', img: 'https://via.placeholder.com/80?text=1' },
      { titulo: 'Naturaleza en el Valle de Cocora', img: 'https://via.placeholder.com/80?text=2' },
      { titulo: 'Miradores + atardecer', img: 'https://via.placeholder.com/80?text=3' },
      { titulo: 'Ruta de café y cata', img: 'https://via.placeholder.com/80?text=4' },
      { titulo: 'Calle Real + artesanías', img: 'https://via.placeholder.com/80?text=5' },
      { titulo: 'Cabalgata por senderos', img: 'https://via.placeholder.com/80?text=6' },
      { titulo: 'Avistamiento de aves temprano', img: 'https://via.placeholder.com/80?text=7' },
      { titulo: 'Gastronomía típica del Quindío', img: 'https://via.placeholder.com/80?text=8' },
      { titulo: 'Plan relax: cafés y fotos', img: 'https://via.placeholder.com/80?text=9' },
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
    ],
    itinerarios: [
      { titulo: 'Ruta cultural', img: 'https://via.placeholder.com/80?text=1' },
      { titulo: 'Mirador + fotografía', img: 'https://via.placeholder.com/80?text=2' },
      { titulo: 'Plan cafetero', img: 'https://via.placeholder.com/80?text=3' },
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

  // ✅ Slider auto
  private timerId: any = null;
  currentSlideIndex = 0;

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

      // reinicia slider al cambiar de pueblo
      this.currentSlideIndex = 0;
      this.startAutoSlider();
    });
  }

  ngOnDestroy(): void {
    this.stopAutoSlider();
  }

  // ✅ toma 2 imágenes: izquierda = actual, derecha = siguiente
  get slideLeft(): string {
    const imgs = this.data?.sliderImgs ?? [];
    if (!imgs.length) return 'https://via.placeholder.com/900x500?text=SLIDE';
    return imgs[this.currentSlideIndex % imgs.length];
  }

  get slideRight(): string {
    const imgs = this.data?.sliderImgs ?? [];
    if (!imgs.length) return 'https://via.placeholder.com/900x500?text=SLIDE';
    return imgs[(this.currentSlideIndex + 1) % imgs.length];
  }

  private startAutoSlider() {
    this.stopAutoSlider();
    const imgs = this.data?.sliderImgs ?? [];
    if (imgs.length <= 1) return;

    this.timerId = setInterval(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % imgs.length;
    }, 1000); // ✅ 1 segundo
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
  console.log('Click categoría:', catKey, 'en', this.slug);

  if (catKey === 'cabalgatas') {
    this.router.navigate(['/cabalgata', this.slug]);
    return;
  }

  console.log('Categoría aún no conectada:', catKey);
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
