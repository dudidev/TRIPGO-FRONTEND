import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SoporteService } from '../../services/soporte.service';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-soporte',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Nav, Footer],
  templateUrl: './soporte.html',
  styleUrls: ['./soporte.css']
})
export class Soporte {
  private fb = inject(FormBuilder);
  private soporteService = inject(SoporteService);

  supportForm: FormGroup;
  status = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  selectedCategory = signal<string>('tecnico');
  selectedPriority = signal<string>('media');

  categories = [
    { value: 'tecnico', label: 'Técnico', icon: '🔧' },
    { value: 'cuenta', label: 'Cuenta', icon: '👤' },
    { value: 'general', label: 'General', icon: '💬' },
    { value: 'sugerencia', label: 'Sugerencia', icon: '💡' }
  ];

  priorities = [
    { value: 'baja', label: 'Baja', color: '#10B981' },
    { value: 'media', label: 'Media', color: '#F59E0B' },
    { value: 'alta', label: 'Alta', color: '#EF4444' },
    { value: 'urgente', label: 'Urgente', color: '#DC2626' }
  ];

  constructor() {
    this.supportForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]]
    });

    // Auto-llenar nombre y email del usuario logueado
    this.loadUserData();
  }

  loadUserData(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.supportForm.patchValue({
          fullName: user.nombre_usuario || '',
          email: user.correo_usuario || ''
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }

  get fullName() { return this.supportForm.get('fullName')!; }
  get email() { return this.supportForm.get('email')!; }
  get subject() { return this.supportForm.get('subject')!; }
  get description() { return this.supportForm.get('description')!; }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  selectPriority(priority: string): void {
    this.selectedPriority.set(priority);
  }

  onSubmit(): void {
    if (this.supportForm.invalid) {
      Object.keys(this.supportForm.controls).forEach(key => {
        this.supportForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.status.set('loading');

    const datos = {
      categoria: this.selectedCategory(),
      prioridad: this.selectedPriority(),
      asunto: this.supportForm.value.subject,
      descripcion: this.supportForm.value.description
    };

    this.soporteService.enviarMensaje(datos).subscribe({
      next: (response) => {
        this.status.set('success');
        this.supportForm.reset();
        this.loadUserData(); // Recargar datos del usuario
      },
      error: (error) => {
        this.status.set('error');
        console.error('Error enviando mensaje:', error);
      }
    });
  }

  resetStatus(): void {
    this.status.set('idle');
    this.selectedCategory.set('tecnico');
    this.selectedPriority.set('media');
  }
}