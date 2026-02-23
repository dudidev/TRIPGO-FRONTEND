import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

export type ApiResponse<T> = {
  ok: boolean;
  data: T;
  error?: any;
};

@Injectable({ providedIn: 'root' })
export class Api {
  private baseUrl = environment.apiBaseUrl;

  private establecimientosSubject = new BehaviorSubject<any[]>([]);
  establecimientos$ = this.establecimientosSubject.asObservable();

  constructor(private http: HttpClient) {}

  // GET (para refrescar estado)
  loadEstablecimientos(): void {
    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/establecimientos`)
      .pipe(map(res => res.data ?? []))
      .subscribe({
        next: (data) => this.establecimientosSubject.next(data),
        error: () => this.establecimientosSubject.next([]),
      });
  }

  // POST (crear)
  crearEstablecimiento(body: { nombre: string; direccion: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/establecimientos`, body).pipe(
      tap(() => {
        // ✅ al crear, refrescamos la lista
        this.loadEstablecimientos();
      })
    );
  }

  // (Opcional) método viejo si lo tienes en otros componentes
  getEstablecimientos(): Observable<any[]> {
    return this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/establecimientos`)
      .pipe(map(res => res.data ?? []));
  }

  // AGREGO ESTE METODO PARA FILTRAR POR PUEBLO Y CATEGORÍA, ASÍ NO HAGO TODO EN EL COMPONENTE
  loadEstablecimientosByTownAndCategory(townSlug: string, categoryKey: string): void {
  const town = encodeURIComponent(townSlug);
  const category = encodeURIComponent(categoryKey);

  this.http
    .get<ApiResponse<any[]>>(
      `${this.baseUrl}/establecimientos/${town}/${category}`
    )
    .pipe(map(res => res.data ?? []))
    .subscribe({
      next: (data) => this.establecimientosSubject.next(data),
      error: () => this.establecimientosSubject.next([]),
    });
}
}
