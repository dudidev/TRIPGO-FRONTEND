import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordResetService } from '../../services/password-reset.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export default class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private passwordResetService = inject(PasswordResetService);
  private router = inject(Router);

  forgotPasswordForm: FormGroup;
  loading = signal(false);
  submitted = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      correo_usuario: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.loading.set(true);
    const correo = this.forgotPasswordForm.value.correo_usuario;

    this.passwordResetService.forgotPassword(correo).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage.set(response.message);
        this.forgotPasswordForm.reset();
        this.submitted.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message || 'Error al procesar la solicitud');
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}