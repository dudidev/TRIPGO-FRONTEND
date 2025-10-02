import { Component, signal} from '@angular/core';

import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-home',
  imports: [Footer],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected readonly bienvenida = signal('Bienvenid@ a TripGO');
}
