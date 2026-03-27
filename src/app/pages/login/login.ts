import { Component } from '@angular/core';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../service/user';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  showPassword = false;

  constructor(
    private userService: User, 
    private router: Router,
    private route: ActivatedRoute,   
    private authService : AuthService ) {}

  showSuccess(message: string) {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => (this.successMessage = ''), 3000);
  }

  togglePassword(): void {
  this.showPassword = !this.showPassword;
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

      this.authService.setSession(res.token, res.user);

      // 👇 Para que el chatbot desaparezca inmediatamente
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('storage'));

      this.showSuccess('Inicio de sesión exitoso');

      setTimeout(() => {

        if (res.user.rol === 'empresa') {
          this.router.navigate(['/empresa']);
        } else {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/principal';
            this.router.navigateByUrl(returnUrl);

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
