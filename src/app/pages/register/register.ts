import { Component } from '@angular/core';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../service/user';
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


    if (form.invalid) {
      this.errorMessage = 'Completa todos los campos.';
      return;
    }


    if (!this.emailRegex.test(this.email)) {
      this.errorMessage = 'Correo inválido.';
      return;
    }


    if (!this.passwordRegex.test(this.password)) {
      this.errorMessage =
        'La contraseña debe tener mínimo 8 caracteres, letras y números.';
      return;
    }


   const ok = this.userService.register({
  name: this.name.trim(),
  email: this.email.trim(),
  password: this.password
});


if (!ok) {
  this.showError('El correo ya está registrado o los datos son inválidos.');
  return;
}


this.showSuccess('Usuario registrado con éxito');


  setTimeout(() => {
  this.router.navigate(['/login']);
  }, 1500);
  }
}
