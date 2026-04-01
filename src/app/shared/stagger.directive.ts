import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[staggerList]',
  standalone: true
})
export class StaggerDirective implements OnInit {
  @Input() staggerDelay: number = 80;   // ms entre cada hijo
  @Input() staggerFrom:  'bottom' | 'left' | 'fade' = 'bottom';

  private el = inject(ElementRef);

  ngOnInit() {
    // Esperar a que los hijos estén en el DOM
    requestAnimationFrame(() => {
      const children = Array.from(
        this.el.nativeElement.children
      ) as HTMLElement[];

      children.forEach((child, i) => {
        child.style.opacity    = '0';
        child.style.transform  = this.getInitialTransform();
        child.style.transition = 'none';

        setTimeout(() => {
          child.style.transition = `
            opacity 420ms cubic-bezier(0.22,1,0.36,1),
            transform 420ms cubic-bezier(0.22,1,0.36,1)
          `;
          child.style.opacity   = '1';
          child.style.transform = 'translate(0,0) scale(1)';
        }, i * this.staggerDelay);
      });
    });
  }

  private getInitialTransform(): string {
    switch (this.staggerFrom) {
      case 'bottom': return 'translateY(32px) scale(0.97)';
      case 'left':   return 'translateX(-24px)';
      case 'fade':   return 'scale(0.96)';
    }
  }
}