import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
@Component({
  selector: 'app-detalles',
  imports: [Nav,CommonModule,Footer],
  templateUrl: './detalles.html',
  styleUrl: './detalles.css'
})
export class Detalles {
  lugar = {
   nombre: 'Cabalgatas San Pedro',
  direccion: 'Carrera 6 #11-35, Salento, Quindío',
  descripcion: 'Sumérgete en la magia del Paisaje Cultural Cafetero (PCC) de Colombia, declarado Patrimonio de la Humanidad, a lomos de nobles caballos. En Cabalgatas San Pedro, te ofrecemos más que un simple paseo: una experiencia de conexión total con la naturaleza, la cultura local y la tradición ecuestre que define nuestra región..',
  promociones: '2x1 en cabalgatas los viernes',
  horarios: [
    'Lunes: Cerrado',
    'Martes a Viernes: 9:00 AM - 5:00 PM',
    'Sábado y Domingo: 8:00 AM - 6:00 PM'
  ],
    imagenes: [
      'https://res.cloudinary.com/dtyvd3fim/image/upload/v1765810725/cabalgata1.1_c0xvp8.jpg',
      'https://res.cloudinary.com/dtyvd3fim/image/upload/v1765811666/Cabalgata1.3_bdeacc.jpg',
      'https://res.cloudinary.com/dtyvd3fim/image/upload/v1765811666/Cabalgata1.2_ymzaji.jpg'
    ],
    opiniones: [
      {
        usuario: 'Pepito Perez',
        comentario: 'Excelente lugar, muy buena atención.',
        rating: 5
      },
      {
        usuario: 'Maria Gomez',
        comentario: 'Me encantó la experiencia, los paisajes son hermosos, pero podrían mejorar un poco la organización. Pero en general, ¡muy recomendable!',
        rating: 4
      }
    ]
  };

  agregarItinerario() {
    console.log('Agregar a itinerario:', this.lugar);
  }


}
