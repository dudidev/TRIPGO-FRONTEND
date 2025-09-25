import { Component, signal } from '@angular/core';

import { Header } from '../../shared/header/header';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-home',
  imports: [Header, Nav, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected readonly bienvenida = signal('Bienvenid@ a TripGO');
}
