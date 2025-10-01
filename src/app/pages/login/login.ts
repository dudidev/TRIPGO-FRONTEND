import { Component } from '@angular/core';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-login',
  imports: [Nav,Footer],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

}
