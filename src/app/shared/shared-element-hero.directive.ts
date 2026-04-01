import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';
import { SharedElementService } from './shared-element.service';

@Directive({
  selector: '[sharedHero]',
  standalone: true
})
export class SharedHeroDirective implements OnInit {
  @Input('sharedHero') key: string = '';

  private el = inject(ElementRef);
  private sharedSvc = inject(SharedElementService);

  ngOnInit() {
    const snap = this.sharedSvc.consume();
    if (!snap || snap.key !== this.key) return;

    const target = this.el.nativeElement;

    // Esperar a que el elemento esté en el DOM con sus dimensiones reales
    requestAnimationFrame(() => {
      const targetRect = target.getBoundingClientRect();
      if (!targetRect.width || !targetRect.height) return;

      const dx = snap.rect.left - targetRect.left;
      const dy = snap.rect.top - targetRect.top;
      const scaleX = snap.rect.width / targetRect.width;
      const scaleY = snap.rect.height / targetRect.height;

      // Solo animar si los valores son razonables
      if (Math.abs(scaleX) > 10 || Math.abs(scaleY) > 10) return;

      target.style.transition = 'none';
      target.style.transformOrigin = 'top left';
      target.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
      target.style.opacity = '0.7';

      requestAnimationFrame(() => {
        target.style.transition = 'transform 400ms cubic-bezier(0.34,1.1,0.64,1), opacity 300ms ease';
        target.style.transform = 'translate(0,0) scale(1)';
        target.style.opacity = '1';
      });
    });
  }
}