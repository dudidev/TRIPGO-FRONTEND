import { Component } from '@angular/core';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../service/user';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
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

    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  onSubmit(form: NgForm) {
    this.errorMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Completa todos los campos.';
      return;
    }

    const success = this.userService.login(this.email, this.password);

    if (success) {
      this.showSuccess('Inicio de sesión exitoso');
      setTimeout(() => {
        this.router.navigate(['/principal']);
      }, 1500);
    } else {
      this.errorMessage = 'Usuario o contraseña inválidos';
    }
  }
}
