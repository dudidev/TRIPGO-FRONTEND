import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PasswordResetService } from '../../services/password-reset.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export default class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private passwordResetService = inject(PasswordResetService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  resetPasswordForm: FormGroup;
  token = signal('');
  loading = signal(false);
  validatingToken = signal(true);
  tokenValid = signal(false);
  submitted = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  constructor() {
    this.resetPasswordForm = this.fb.group({
      nueva_password: ['', [Validators.required, Validators.minLength(6)]],
      confirmar_password: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (!token) {
        this.errorMessage.set('Token no proporcionado');
        this.validatingToken.set(false);
        return;
      }

      this.token.set(token);
      this.validateToken(token);
    });
  }

  validateToken(token: string): void {
    this.passwordResetService.validateResetToken(token).subscribe({
      next: (response) => {
        this.validatingToken.set(false);
        this.tokenValid.set(response.valid);
        if (!response.valid) {
          this.errorMessage.set(response.message || 'Token inválido o expirado');
        }
      },
      error: (error) => {
        this.validatingToken.set(false);
        this.tokenValid.set(false);
        this.errorMessage.set(error.error?.message || 'Error al validar el token');
      }
    });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('nueva_password')?.value;
    const confirmPassword = group.get('confirmar_password')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get f() {
    return this.resetPasswordForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.errorMessage.set(null);

    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.loading.set(true);
    const nuevaPassword = this.resetPasswordForm.value.nueva_password;

    this.passwordResetService.resetPassword(this.token(), nuevaPassword).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage.set(response.message);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message || 'Error al restablecer la contraseña');
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  requestNewToken(): void {
    this.router.navigate(['/forgot-password']);
  }
}