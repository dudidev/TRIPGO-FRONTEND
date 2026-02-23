import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { MapaComponent } from '../../shared/mapa/mapa';

type Opinion = {
  usuario: string;
  comentario: string;
  rating: number;
};

type LugarDetalle = {
  slug: string;
  nombre: string;
  direccion: string;
  descripcion: string;
  promociones?: string;
  horarios: string[];
  imagenes: string[];
  opiniones: Opinion[];
  datosGenerales?: string[];

  // opcionales para navegación / breadcrumb
    lat: number;
  lng: number;
  townSlug?: string;
  categoryKey?: string;
};

const DETALLES_DATA: Record<string, LugarDetalle> = {
  'cabalgatas-san-pablo': {
    slug: 'cabalgatas-san-pablo',
    nombre: 'Cabalgatas San Pablo',
    direccion: 'Salento, Quindío',
    descripcion:
      'Sumérgete en la magia del Paisaje Cultural Cafetero (PCC) de Colombia, declarado Patrimonio de la Humanidad, a lomos de nobles caballos. En Cabalgatas San Pablo, te ofrecemos más que un simple paseo: una experiencia de conexión total con la naturaleza, la cultura local y la tradición ecuestre.',
    promociones: '2x1 en cabalgatas los viernes',
    horarios: [
      'Lunes: Cerrado',
      'Martes a Viernes: 9:00 AM - 5:00 PM',
      'Sábado y Domingo: 8:00 AM - 6:00 PM',
    ],
    imagenes: [
      'https://res.cloudinary.com/dtyvd3fim/image/upload/v1765810725/cabalgata1.1_c0xvp8.jpg',
      'https://res.cloudinary.com/dtyvd3fim/image/upload/v1765811666/Cabalgata1.3_bdeacc.jpg',
      'https://res.cloudinary.com/dtyvd3fim/image/upload/v1765811666/Cabalgata1.2_ymzaji.jpg',
    ],
    opiniones: [
      {
        usuario: 'Pepito Perez',
        comentario: 'Excelente lugar, muy buena atención.',
        rating: 5,
      },
      {
        usuario: 'Maria Gomez',
        comentario:
          'Me encantó la experiencia, los paisajes son hermosos, pero podrían mejorar un poco la organización. En general, ¡muy recomendable!',
        rating: 4,
      },
    ],
    townSlug: 'salento',
    categoryKey: 'cabalgatas',
    lat: 4.636726020028663,
    lng: -75.57155783394442,
  },

  // Ejemplo: agrega más slugs aquí
  'caminos-y-trochas': {
    slug: 'caminos-y-trochas',
    nombre: 'Cabalgatas Caminos y Trochas',
    direccion: 'Salento, Quindío',
    descripcion:
      'Recorridos por caminos rurales y senderos con paradas para fotos. Ideal para una salida tranquila en naturaleza.',
    promociones: '10% off entre semana',
    horarios: [
      'Lunes a Viernes: 9:00 AM - 5:00 PM',
      'Sábado y Domingo: 8:00 AM - 6:00 PM',
    ],
    imagenes: [
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733201/portada_-_categoria_5_t7pmpz.jpg',
    ],
   opiniones: [
      {
        usuario: 'Pedro Fernandez',
        comentario: 'Excelente lugar, muy buena atención.',
        rating: 5,
      },
      {
        usuario: 'Michel Rodriguez',
        comentario:
          'Me encantó la experiencia, los paisajes son hermosos, pero podrían mejorar un poco la organización. En general, ¡muy recomendable!',
        rating: 4,
      },
    ],
    townSlug: 'salento',
    categoryKey: 'cabalgatas',
    lat: 4.648624532903637,
    lng: -75.48515657977302,
  },
  'alquiler-caballos-salento': {
    slug: 'alquiler-caballos-salento',
    nombre: 'Alquiler de Caballos Salento',
    direccion: 'Salento, Quindío',
    descripcion:
      'Alquiler de caballos para disfrutar de la naturaleza y el paisaje del Valle del cocora.',
    promociones: '10% off entre semana',
    horarios: [
      'Lunes a Viernes: 9:00 AM - 5:00 PM',
      'Sábado y Domingo: 8:00 AM - 6:00 PM',
    ],
    imagenes: [
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733201/portada_-_categoria_5_t7pmpz.jpg',
    ],
     opiniones: [
      {
        usuario: 'Pedro Fernandez',
        comentario: 'Excelente lugar, muy buena atención.',
        rating: 5,
      },
      {
        usuario: 'Michel Rodriguez',
        comentario:
          'Me encantó la experiencia, los paisajes son hermosos, pero podrían mejorar un poco la organización. En general, ¡muy recomendable!',
        rating: 4,
      },
    ], 
    townSlug: 'salento',
    categoryKey: 'cabalgatas',
    lat:   4.654863733626751,
    lng: -75.5757018934317,
  },
  'COCORATOURS1': {
    slug: 'COCORATOURS1',
    nombre: 'CocoraTours - Excursión grupal valle del cocora',
    direccion: 'Direccion: barrio las Colinas, calle 2 # 6-09, Salento Quindio. ',
    descripcion:'Este tour económico incluye un recorrido en jeep tradicional hasta el Valle de Cocora, donde iniciaremos una caminata por diversas atracciones artificiales perfectas para tomarte fotos memorables. Entre ellas encontrarás el famoso jeep con la bandera y costales de café, el letrero Cocora, las mallas, la casa tradicional y esculturas de fauna local como el puma, el oso, el venado y el emblemático nido del cóndor.'+'\n'+'\n'+
     'También podrás conocer la famosa mano azul con fondo de palmas de cera. Si prefieres un recorrido más natural y menos fotográfico, puedes omitir estas paradas y adaptar la experiencia a tu gusto.El recorrido continúa con un tour caminando de aproximadamente 2 a 3 horas por los hermosos valles de palmas, pasando por miradores naturales que ofrecen vistas panorámicas de 360 grados sobre todo el Valle de Cocora.'+'\n'+'\n'+ 'Durante la caminata,' +
     'disfrutarás de paisajes únicos, cuencas de ríos y las majestuosas palmas de cera, el árbol nacional más alto de Colombia. Este tour económico es perfecto para quienes desean explorar la naturaleza, capturar momentos increíbles y vivir una experiencia auténtica sin afectar demasiado su presupuesto.',
    datosGenerales: [
      'Duración: 4-5 horas. ',
      'Dificultad: Media. ',
      'Transporte ida y regreso en Jeep Willys. ',
      'Entrada al bosque de palmas( Mano, mallas, nido, miradores).',
      'Guia turistico local. '
    ], 
    
    promociones: '',
    horarios: [
      'Lunes a Viernes: 9:00 AM - 5:00 PM',
      'Sábado y Domingo: 8:00 AM - 6:00 PM',
    ],
    imagenes: [
      'https://res.cloudinary.com/dtyvd3fim/image/upload/v1770910663/01-01LUGAR_uvwc5d.png',
      'https://res.cloudinary.com/dtyvd3fim/image/upload/v1770910663/01-02LUGAR_gbdupb.png',
      'https://res.cloudinary.com/dtyvd3fim/image/upload/v1770910663/01-03LUGAR_hzgc9d.png',
    ],
     opiniones: [
      {
        usuario: 'Pedro Fernandez',
        comentario: 'Excelente lugar, muy buena atención.',
        rating: 5,
      },
      {
        usuario: 'Michel Rodriguez',
        comentario:
          'Me encantó la experiencia, los paisajes son hermosos, pero podrían mejorar un poco la organización. En general, ¡muy recomendable!',
        rating: 4,
      },
    ],
    townSlug: 'salento',
    categoryKey: 'valle-cocora',
    lat:4.6389628880699325,
    lng: -75.56772317805938,
  },

};

@Component({
  selector: 'app-detalles',
  standalone: true,
  imports: [Nav, CommonModule, Footer, RouterModule, MapaComponent],
  templateUrl: './detalles.html',
  styleUrl: './detalles.css',
})
export class Detalles {
  slug = '';

  // lugar actual (o null si no existe)
  lugar: LugarDetalle | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.slug = params.get('slug') || '';

      // Busca el lugar por slug
      const data = DETALLES_DATA[this.slug] ?? null;

      // si no existe
      if (!data) {
        this.lugar = null;
        return;
      }

      this.lugar = data;
    });
  }

  agregarItinerario() {
    if (!this.lugar) return;
    console.log('Agregar a itinerario:', this.lugar);
  }
}
