import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { ContactService } from '../../services/contact.service';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  imports: [Nav, Footer, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {

  private fb = inject(FormBuilder);
  private contactSvc = inject(ContactService);

  // Estado del envío como signal
  status = signal<FormStatus>('idle');

  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  // Helpers para el template
  get name() { return this.contactForm.get('name')!; }
  get email() { return this.contactForm.get('email')!; }
  get message() { return this.contactForm.get('message')!; }

  onSubmit(): void {
    if (this.contactForm.invalid || this.status() === 'loading') return;

    this.status.set('loading');

    const payload = {
      name: this.name.value!.trim(),
      email: this.email.value!.trim(),
      message: this.message.value!.trim()
    };

    this.contactSvc.sendContactEmail(payload).subscribe({
      next: () => {
        this.status.set('success');
        this.contactForm.reset();
      },
      error: () => {
        this.status.set('error');
      }
    });
  }

  resetStatus(): void {
    this.status.set('idle');
  }
}