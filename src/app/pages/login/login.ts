import { Component } from '@angular/core';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ItinerarioService } from '../../service/itinerario.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Nav, Footer, FormsModule, RouterLink, TranslateModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  isLoading = false; // ✅ para deshabilitar el botón mientras carga

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private itinerarioService: ItinerarioService
  ) {}
  // ✅ Se eliminó userService — el login ahora lo maneja AuthService directamente

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

    this.isLoading = true;

    // ✅ Usar authService.login() directamente — ya no necesitas userService
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.isLoading = false;

        // ✅ Se eliminó setSession — ya no guarda nada en localStorage
        // ✅ Se eliminaron los window.dispatchEvent('storage') — ya no aplican

        this.itinerarioService.reload();
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
        this.isLoading = false;
        this.errorMessage = 'Usuario o contraseña inválidos';
        setTimeout(() => this.errorMessage = '', 1200);
      }
    });
  }
}