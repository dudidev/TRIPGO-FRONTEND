import { Component, signal} from '@angular/core';

import { Footer } from '../../shared/footer/footer';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Footer,RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected readonly bienvenida = signal('Bienvenid@ a TripGO');
}
