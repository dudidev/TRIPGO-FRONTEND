import { Component } from '@angular/core';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';

import { Router } from '@angular/router';
import { User } from '../../service/user';

@Component({
  selector: 'app-login',
  imports: [Nav,Footer],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

   constructor(private userService: User, private router: Router) {}

  onLogin(form: any) {
    const success = this.userService.login(form.email, form.password);

    if (success) {
      alert('Bienvenido');
      this.router.navigate(['/principal']);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  }

}
