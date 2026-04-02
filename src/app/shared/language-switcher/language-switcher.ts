import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Language } from '../../service/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-switcher">
      <button
        type="button"
        class="lang-btn"
        [class.active]="currentLang === 'es'"
        (click)="setLanguage('es')"
      >
        🇪🇸 ES
      </button>
      <button
        type="button"
        class="lang-btn"
        [class.active]="currentLang === 'en'"
        (click)="setLanguage('en')"
      >
        🇺🇸 EN
      </button>
    </div>
  `,
  styles: [`
    .language-switcher {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .lang-btn {
      background: transparent;
      border: 2px solid rgba(14, 105, 115, 0.2);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 600;
      color: #6B7280;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .lang-btn:hover {
      border-color: #0E6973;
      color: #0E6973;
      transform: translateY(-1px);
    }

    .lang-btn.active {
      background: linear-gradient(135deg, #0E6973, #117A87);
      border-color: #0E6973;
      color: white;
      box-shadow: 0 2px 8px rgba(14, 105, 115, 0.3);
    }
  `]
})
export class LanguageSwitcher {
  private languageService = inject(LanguageService);

  get currentLang(): Language {
    return this.languageService.getCurrentLanguage();
  }

  setLanguage(lang: Language): void {
    this.languageService.setLanguage(lang);
  }
}