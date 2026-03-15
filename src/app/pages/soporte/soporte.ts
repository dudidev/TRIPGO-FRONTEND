import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';


type Status = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-soporte',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Nav, Footer],
  templateUrl: './soporte.html',
  styleUrls: ['./soporte.css'],
})
export class Soporte {

  status = signal<Status>('idle');
  selectedCategory = signal<string>('general');
  selectedPriority = signal<string>('media');

  categories = [
    { value: 'general',    icon: '🧭', label: 'General' },
    { value: 'cuenta',     icon: '👤', label: 'Mi cuenta' },
    { value: 'reservas',   icon: '📅', label: 'Reservas' },
    { value: 'tecnico',    icon: '🛠️', label: 'Técnico' },
    
  ];

  priorities = [
    { value: 'baja',  label: 'Baja',  color: '#28a745' },
    { value: 'media', label: 'Media', color: '#ffc107' },
    { value: 'alta',  label: 'Alta',  color: '#dc3545' },
  ];

  supportForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.supportForm = this.fb.group({
      fullName:    ['', Validators.required],
      email:       ['', [Validators.required, Validators.email]],
      subject:     ['', Validators.required],
      priority:    ['media'],
      description: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  get fullName()    { return this.supportForm.get('fullName')!; }
  get email()       { return this.supportForm.get('email')!; }
  get subject()     { return this.supportForm.get('subject')!; }
  get description() { return this.supportForm.get('description')!; }

  selectCategory(value: string) {
    this.selectedCategory.set(value);
  }

  selectPriority(value: string) {
  this.selectedPriority.set(value);
  this.supportForm.patchValue({ priority: value });
}

  async onSubmit() {
    if (this.supportForm.invalid) {
      this.supportForm.markAllAsTouched();
      return;
    }

    this.status.set('loading');

    const payload = {
      ...this.supportForm.value,
      category: this.selectedCategory(),
    };

    try {
      // Reemplaza esta URL con tu endpoint real
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error en el servidor');

      this.status.set('success');
      this.supportForm.reset({ priority: 'media' });
    } catch {
      this.status.set('error');
    }
  }

  resetStatus() {
    this.status.set('idle');
  }
}
