import { Component } from '@angular/core';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-home',
  imports: [Nav,Footer],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
