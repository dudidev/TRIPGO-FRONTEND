import { Injectable } from '@angular/core';

export type Lang = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly KEY = 'tripgo_lang';
  private lang: Lang = (localStorage.getItem(this.KEY) as Lang) || 'es';

  get current(): Lang {
    return this.lang;
  }

  set(lang: Lang) {
    this.lang = lang;
    localStorage.setItem(this.KEY, lang);
  }

  toggle() {
    this.set(this.lang === 'es' ? 'en' : 'es');
  }
}