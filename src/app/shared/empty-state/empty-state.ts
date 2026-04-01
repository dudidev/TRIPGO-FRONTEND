// empty-state.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-empty',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="empty">
      <div class="empty__illustration">
        <!-- Mapa con pin — búsqueda sin resultados -->
        <svg *ngIf="type==='search'" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="58" fill="#f0fafa" stroke="#0E6973" stroke-width="2" stroke-dasharray="6 4"/>
          <ellipse cx="60" cy="95" rx="28" ry="5" fill="#0E6973" opacity=".08"/>
          <path d="M60 20c-14 0-25 11-25 25 0 18 25 42 25 42s25-24 25-42c0-14-11-25-25-25z" fill="#E27921" opacity=".15"/>
          <path d="M60 22c-13 0-23 10-23 23 0 17 23 40 23 40s23-23 23-40c0-13-10-23-23-23z" stroke="#E27921" stroke-width="2" fill="none"/>
          <circle cx="60" cy="45" r="7" fill="#E27921"/>
          <path d="M38 88h44" stroke="#0E6973" stroke-width="2" stroke-linecap="round" opacity=".3"/>
          <circle cx="34" cy="88" r="3" fill="#0E6973" opacity=".3"/>
          <circle cx="86" cy="88" r="3" fill="#0E6973" opacity=".3"/>
        </svg>

        <!-- Categorías vacías -->
        <svg *ngIf="type==='categoria'" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="58" fill="#f0fafa" stroke="#0E6973" stroke-width="2" stroke-dasharray="6 4"/>
          <rect x="28" y="38" width="28" height="28" rx="10" fill="#0E6973" opacity=".12" stroke="#0E6973" stroke-width="1.5"/>
          <rect x="64" y="38" width="28" height="28" rx="10" fill="#E27921" opacity=".12" stroke="#E27921" stroke-width="1.5"/>
          <rect x="28" y="72" width="28" height="18" rx="8" fill="#0E6973" opacity=".08" stroke="#0E6973" stroke-width="1.5"/>
          <rect x="64" y="72" width="28" height="18" rx="8" fill="#E27921" opacity=".08" stroke="#E27921" stroke-width="1.5"/>
          <path d="M44 52l-4 4 4 4M76 52l4 4-4 4" stroke="#0E6973" stroke-width="2" stroke-linecap="round"/>
        </svg>

        <!-- Lugares vacíos -->
        <svg *ngIf="type==='lugar'" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="58" fill="#f0fafa" stroke="#0E6973" stroke-width="2" stroke-dasharray="6 4"/>
          <rect x="22" y="50" width="76" height="46" rx="12" fill="#0E6973" opacity=".07" stroke="#0E6973" stroke-width="1.5"/>
          <rect x="30" y="42" width="60" height="14" rx="7" fill="#E27921" opacity=".15" stroke="#E27921" stroke-width="1.5"/>
          <circle cx="42" cy="70" r="8" fill="#0E6973" opacity=".15"/>
          <circle cx="78" cy="70" r="8" fill="#E27921" opacity=".15"/>
          <path d="M54 75h12" stroke="#0E6973" stroke-width="2" stroke-linecap="round" opacity=".4"/>
          <path d="M42 28c0-6 18-6 18 0" stroke="#0E6973" stroke-width="2" stroke-linecap="round" opacity=".3"/>
        </svg>

        <!-- Reseñas vacías -->
        <svg *ngIf="type==='resena'" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="58" fill="#f0fafa" stroke="#0E6973" stroke-width="2" stroke-dasharray="6 4"/>
          <path d="M30 45h60v36a8 8 0 01-8 8H38a8 8 0 01-8-8V45z" fill="#0E6973" opacity=".08" stroke="#0E6973" stroke-width="1.5"/>
          <path d="M30 45l30-18 30 18" stroke="#0E6973" stroke-width="1.5" fill="none"/>
          <path d="M44 68l6-6 4 4 10-10 4 4" stroke="#E27921" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <!-- Favoritos vacíos -->
        <svg *ngIf="type==='favorito'" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="58" fill="#fff0f5" stroke="#E27921" stroke-width="2" stroke-dasharray="6 4"/>
          <path d="M60 85s-30-18-30-38a20 20 0 0140 0 20 20 0 0140 0c0 20-30 38-30 38" fill="#E27921" opacity=".12" stroke="#E27921" stroke-width="2"/>
          <path d="M46 52a8 8 0 018-8" stroke="#E27921" stroke-width="2" stroke-linecap="round" opacity=".5"/>
        </svg>
      </div>

      <h3 class="empty__title">{{ title }}</h3>
      <p class="empty__desc">{{ description }}</p>

      <a *ngIf="actionLabel && actionRoute"
         [routerLink]="actionRoute"
         class="empty__btn">
        {{ actionLabel }}
      </a>

      <button *ngIf="actionLabel && !actionRoute"
              class="empty__btn"
              type="button"
              (click)="onAction()">
        {{ actionLabel }}
      </button>
    </div>
  `,
  styles: [`
    .empty {
      display: flex; flex-direction: column;
      align-items: center; text-align: center;
      padding: 2.5rem 1.5rem; gap: 10px;
    }
    .empty__illustration svg {
      width: 110px; height: 110px;
      animation: emptyFloat 3s ease-in-out infinite;
    }
    @keyframes emptyFloat {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-8px); }
    }
    .empty__title {
      font-size: 16px; font-weight: 800;
      color: #0F3B3E; margin: 6px 0 0;
    }
    .empty__desc {
      font-size: 13px; color: #888;
      line-height: 1.6; max-width: 260px; margin: 0;
    }
    .empty__btn {
      margin-top: 6px;
      display: inline-flex; align-items: center;
      background: #0E6973; color: #fff;
      border: none; border-radius: 50px;
      padding: 10px 22px; font-size: 13px;
      font-weight: 700; cursor: pointer;
      text-decoration: none;
      transition: background 0.2s, transform 0.15s;
      font-family: inherit;
    }
    .empty__btn:hover { background: #0a5a63; transform: translateY(-2px); }
  `]
})
export class EmptyStateComponent {
  @Input() type: 'search' | 'categoria' | 'lugar' | 'resena' | 'favorito' = 'search';
  @Input() title: string = 'Sin resultados';
  @Input() description: string = 'No encontramos nada por aquí.';
  @Input() actionLabel?: string;
  @Input() actionRoute?: string;

  onAction() {}
}