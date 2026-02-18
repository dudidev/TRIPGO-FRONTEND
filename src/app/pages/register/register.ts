import { Component } from '@angular/core';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { Router, RouterLink } from '@angular/router';
import { User, Role } from '../../service/user';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  imports: [Nav, Footer, FormsModule, RouterLink, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  name = '';
  email = '';
  password = '';

  errorMessage = '';
  successMessage = '';

  emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  constructor(private userService: User, private router: Router) {}

  showSuccess(message: string) {
    this.successMessage = message;
    this.errorMessage = '';

    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  showError(message: string) {
    this.errorMessage = message;
    this.successMessage = '';

    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  onSubmit(form: NgForm) {
    this.errorMessage = '';

    // 1) Validación básica formulario
    if (form.invalid) {
      this.showError('Completa todos los campos.');
      return;
    }

    // 2) Validación email
    if (!this.emailRegex.test(this.email.trim())) {
      this.showError('Correo inválido.');
      return;
    }

    // 3) Validación password
    if (!this.passwordRegex.test(this.password.trim())) {
      this.showError('La contraseña debe tener mínimo 8 caracteres, letras y números.');
      return;
    }

   const payload: {
  nombre_usuario: string;
  correo_usuario: string;
  password_u: string;
  rol: Role;
} = {
  nombre_usuario: this.name.trim(),
  correo_usuario: this.email.trim().toLowerCase(),
  password_u: this.password.trim(),
  rol: 'usuario'
};


    this.userService.register(payload).subscribe({
      next: () => {
        this.showSuccess('Usuario registrado con éxito');

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        // Mensajes típicos del backend
        const msg =
          err?.error?.message ||
          'No se pudo registrar. Verifica los datos o si el correo ya existe.';
        this.showError(msg);
      }
    });
  }
}
