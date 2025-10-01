<<<<<<< HEAD
import { Component, signal } from '@angular/core';

import { Header } from '../../shared/header/header';
=======
import { Component } from '@angular/core';
>>>>>>> feature-karol
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-home',
<<<<<<< HEAD
  imports: [Header, Nav, Footer],
=======
  imports: [Nav,Footer],
>>>>>>> feature-karol
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected readonly bienvenida = signal('Bienvenid@ a TripGO');
}
