// shared-element.directive.ts
import { Directive, ElementRef, Input, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedElementService } from './shared-element.service';

@Directive({
  selector: '[sharedElement]',
  standalone: true
})
export class SharedElementDirective {
  @Input('sharedElement') navigateTo: string = '';
  @Input() sharedKey: string = '';
  @Input() sharedImage: string = '';

  private el = inject(ElementRef);
  private sharedSvc = inject(SharedElementService);
  private router = inject(Router);

  @HostListener('click')
onClick() {
  // Capturar el elemento host (el button completo)
  const hostEl = this.el.nativeElement;
  
  // Intentar encontrar la imagen dentro de la card
  const imgEl = hostEl.querySelector('img') ?? hostEl;
  
  // Usar el rect del host para coordenadas más estables
  this.sharedSvc.capture(hostEl, this.sharedKey, this.sharedImage);
  this.router.navigateByUrl(this.navigateTo);
}
}