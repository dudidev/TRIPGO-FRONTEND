import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // ✅ Usuario en memoria — nunca en localStorage
  private currentUser = signal<any>(null);

  constructor(private http: HttpClient, private router: Router) {
    // ✅ Al arrancar la app, recuperar usuario del backend si hay cookie activa
    this.restoreSession();
  }

  // ─── Login ────────────────────────────────────────────
  login(correo_usuario: string, password_u: string): Observable<any> {
    return this.http.post('/api/auth/login',
      { correo_usuario, password_u },
      { withCredentials: true }   // ← envía y recibe cookies
    ).pipe(
      tap((res: any) => {
        // ✅ Solo guardamos el user (no el token, eso lo maneja la cookie)
        this.currentUser.set(res.user);
      })
    );
  }

  // ─── Logout ───────────────────────────────────────────
  logout(): void {
    this.http.post('/api/auth/logout', {}, { withCredentials: true })
      .subscribe({
        next: () => {
          this.currentUser.set(null);
          // ✅ Solo limpiar lo que NO es sensible
          localStorage.removeItem('tripgo_itinerario_v1');
          this.router.navigate(['/login']);
        },
        error: () => {
          // Limpiar igual aunque falle el backend
          this.currentUser.set(null);
          this.router.navigate(['/login']);
        }
      });
  }

  // ─── Sesión activa ────────────────────────────────────
  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  getCurrentUser(): any {
    return this.currentUser();
  }

  // ─── Restaurar sesión al recargar la página ───────────
  // El backend valida la cookie y devuelve el usuario
  private restoreSession(): void {
    this.http.get('/api/auth/me', { withCredentials: true })
      .subscribe({
        next: (res: any) => this.currentUser.set(res.user),
        error: ()         => this.currentUser.set(null)
      });
  }
}