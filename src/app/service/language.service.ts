import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'es' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translate = inject(TranslateService);
  private readonly STORAGE_KEY = 'tripgo_language';
  current: any;

  constructor() {
    this.initLanguage();
  }

  private initLanguage(): void {
    // Idiomas disponibles
    this.translate.addLangs(['es', 'en']);

    // Idioma por defecto
    this.translate.setDefaultLang('es');

    // Cargar idioma guardado o usar default
    const savedLang = this.getSavedLanguage();
    this.translate.use(savedLang);
  }

  getCurrentLanguage(): Language {
    return this.translate.currentLang as Language;
  }

  private getSavedLanguage(): Language {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return (saved === 'en' || saved === 'es') ? saved : 'es';
  }

  setLanguage(lang: Language): void {
    this.translate.use(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
  }

  toggleLanguage(): void {
    const currentLang = this.getCurrentLanguage();
    const newLang: Language = currentLang === 'es' ? 'en' : 'es';
    this.setLanguage(newLang);
  }

  // Helper para obtener traducciones de forma síncrona
  instant(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }
}