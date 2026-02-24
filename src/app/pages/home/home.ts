import { Component, signal, AfterViewInit } from '@angular/core';
import { Footer } from '../../shared/footer/footer';
import { RouterLink } from '@angular/router';
import { Nav } from '../../shared/nav/nav';

@Component({
  selector: 'app-home',
  imports: [Footer, RouterLink, Nav],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements AfterViewInit {
  

  protected readonly bienvenida = signal('Bienvenid@ a TripGO');

  ngAfterViewInit(): void {
    let index: number = 0;
    const images: NodeListOf<HTMLImageElement> =
      document.querySelectorAll(".carousel-img");

    if (images.length === 0) {
      console.error('No se encontraron imágenes con la clase .carousel-img');
      return;
    }

    images[0].classList.add('active');

    setInterval(() => {
      images[index].classList.remove("active");
      index = (index + 1) % images.length;
      images[index].classList.add("active");
    }, 4000);
  }
}
