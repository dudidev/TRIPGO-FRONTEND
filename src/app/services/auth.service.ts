import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUser = signal<any>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.restoreSession();
  }

  login(correo_usuario: string, password_u: string): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/auth/login`,
      { correo_usuario, password_u },
      { withCredentials: true }
    ).pipe(
      tap((res: any) => {
        this.currentUser.set(res.user);
      })
    );
  }

  logout(): void {
    this.http.post(`${environment.apiBaseUrl}/auth/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          this.currentUser.set(null);
          localStorage.removeItem('tripgo_itinerario_v1');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.currentUser.set(null);
          this.router.navigate(['/login']);
        }
      });
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  getCurrentUser(): any {
    return this.currentUser();
  }

  private restoreSession(): void {
    this.http.get(`${environment.apiBaseUrl}/auth/me`, { withCredentials: true })
      .subscribe({
        next: (res: any) => this.currentUser.set(res.user),
        error: ()         => this.currentUser.set(null)
      });
  }
}