import { Component } from '@angular/core';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';

import { Router } from '@angular/router';
import { User } from '../../service/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [Nav,Footer,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';
  errorMessage = '';

  constructor(private userService: User, private router: Router) {}

  onSubmit() {
    const success = this.userService.login(this.email, this.password);

    if (success) {
      alert('Login exitoso');
      this.router.navigate(['/principal']);
    } else {
      this.errorMessage = 'Usuario o contraseña inválidos';
    }
  }
}
