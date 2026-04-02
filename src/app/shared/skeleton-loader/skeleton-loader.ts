// skeleton-loader.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-wrap">
      
      <!-- TIPO: card de categoría (imagen cuadrada + texto) -->
      <ng-container *ngIf="type === 'categoria'">
        <div class="sk-grid">
          <div class="sk-item" *ngFor="let i of items">
            <div class="sk-img sq shimmer"></div>
            <div class="sk-line short shimmer"></div>
          </div>
        </div>
      </ng-container>

      <!-- TIPO: card de lugar (imagen wide + título + subtítulo) -->
      <ng-container *ngIf="type === 'lugar'">
        <div class="sk-list">
          <div class="sk-card" *ngFor="let i of items">
            <div class="sk-img wide shimmer"></div>
            <div class="sk-line shimmer"></div>
            <div class="sk-line short shimmer"></div>
          </div>
        </div>
      </ng-container>

      <!-- TIPO: hero (banner grande) -->
      <ng-container *ngIf="type === 'hero'">
        <div class="sk-hero shimmer"></div>
      </ng-container>

      <!-- TIPO: detalle (hero + bloques de texto) -->
      <ng-container *ngIf="type === 'detalle'">
        <div class="sk-hero shimmer"></div>
        <div class="sk-body">
          <div class="sk-line shimmer" style="width:60%"></div>
          <div class="sk-line shimmer"></div>
          <div class="sk-line shimmer"></div>
          <div class="sk-line short shimmer" style="width:40%"></div>
        </div>
      </ng-container>

    </div>
  `,
  styleUrl: './skeleton-loader.css'
})
export class SkeletonLoaderComponent {
  @Input() type: 'categoria' | 'lugar' | 'hero' | 'detalle' = 'lugar';
  @Input() count: number = 4;
  get items() { return Array(this.count); }
}