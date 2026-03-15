import { Component } from '@angular/core';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../service/user';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Nav, Footer, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(private userService: User, private router: Router) {}

  showSuccess(message: string) {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => (this.successMessage = ''), 3000);
  }

 onSubmit(form: NgForm) {

  if (form.invalid) {
    this.errorMessage = 'Completa todos los campos.';
    return;
  }

  this.userService.login({
    correo_usuario: this.email,
    password_u: this.password
  }).subscribe({
    next: (res) => {

      // 🔐 Guardar token
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));

      this.showSuccess('Inicio de sesión exitoso');

      setTimeout(() => {

        if (res.user.rol === 'empresa') {
          this.router.navigate(['/empresa']);
        } else {
          this.router.navigate(['/principal']);
        }

      }, 900); 

    },
    error: () => {
      this.errorMessage = 'Usuario o contraseña inválidos';
      setTimeout(() => this.errorMessage = '', 1200);
    }
  });
}

}
