import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DarkModeService {

  private readonly KEY = 'tripgo-dark-mode';
  isDark = signal(false);

  constructor() {
    // 1. Preferencia guardada
    const saved = localStorage.getItem(this.KEY);
    if (saved !== null) {
      this.apply(saved === 'true');
      return;
    }
    // 2. Preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.apply(prefersDark);
  }

  toggle(): void {
    this.apply(!this.isDark());
  }

  private apply(dark: boolean): void {
    this.isDark.set(dark);
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem(this.KEY, String(dark));
  }
}