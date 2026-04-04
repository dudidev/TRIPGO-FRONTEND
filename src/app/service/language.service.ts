import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'es' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translate = inject(TranslateService);
  private readonly STORAGE_KEY = 'tripgo_language';

  constructor() {
    this.initLanguage();
  }

  private initLanguage(): void {
    this.translate.addLangs(['es', 'en']);
    this.translate.setFallbackLang('es');

    const savedLang = this.getSavedLanguage();
    this.current = savedLang;

    this.translate.use(savedLang).subscribe();
  }

  current: Language = 'es';

  getCurrentLanguage(): Language {
    return this.current;
  }

  private getSavedLanguage(): Language {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved === 'en' || saved === 'es' ? saved : 'es';
  }

  setLanguage(lang: Language): void {
    this.translate.use(lang).subscribe(() => {
      localStorage.setItem(this.STORAGE_KEY, lang);
      this.current = lang;
    });
  }

  toggleLanguage(): void {
    const newLang: Language =
      this.getCurrentLanguage() === 'es' ? 'en' : 'es';
      
    this.setLanguage(newLang);
  }

  instant(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }
}