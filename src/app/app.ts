// app.component.ts - versión corregida
import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { ChatFlotante } from './shared/chat-flotante/chat-flotante';
import { slideRouteAnimation } from './shared/route-animations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChatFlotante],
  animations: [slideRouteAnimation],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('TripGO');
  
  // Estado actual de la animación
  private currentAnimState: 'forward' | 'back' = 'forward';
  
  // Historial de rutas para detectar dirección
  private routeHistory: string[] = [];
  
  // Flag para detectar navegación con botón atrás del browser
  private isPopState = false;

  constructor(private router: Router) {
    // Detectar si es popstate (botón atrás del browser)
    window.addEventListener('popstate', () => {
      this.isPopState = true;
    });

    this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        if (this.isPopState) {
          this.currentAnimState = 'back';
          this.isPopState = false;
        } else {
          // Si la URL destino ya está en el historial → back
          // Si es nueva → forward
          const targetUrl = e.url;
          const idx = this.routeHistory.lastIndexOf(targetUrl);
          
          if (idx !== -1 && idx < this.routeHistory.length - 1) {
            this.currentAnimState = 'back';
            // Limpiar historial hasta ese punto
            this.routeHistory = this.routeHistory.slice(0, idx + 1);
          } else {
            this.currentAnimState = 'forward';
          }
        }
      }

      if (e instanceof NavigationEnd) {
        // Solo agregar si no es duplicado del último
        const url = e.urlAfterRedirects;
        if (this.routeHistory[this.routeHistory.length - 1] !== url) {
          this.routeHistory.push(url);
        }
      }
    });
  }

  getRouteState(outlet: RouterOutlet) {
    // Si hay ruta activa, retornar la dirección. Si no, nada.
    return outlet?.isActivated ? this.currentAnimState : '';
  }
}