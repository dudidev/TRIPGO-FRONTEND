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
  private httpOptions = { withCredentials: true };

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
        this.loadEstablecimientos();
      })
    );
  }

  // GET todos los establecimientos (sin estado)
  getEstablecimientos(): Observable<any[]> {
    return this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/establecimientos`)
      .pipe(map(res => res.data ?? []));
  }

  // GET tipos por pueblo
  getTiposByTown(townSlug: string): Observable<any[]> {
    const town = encodeURIComponent(townSlug);
    return this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/tipos/por-ubicacion/${town}`)
      .pipe(map(res => res.data ?? []));
  }

  // GET establecimientos por pueblo y tipo
  loadEstablecimientosByTownAndTipoId(townSlug: string, idTipo: number): void {
    const town = encodeURIComponent(townSlug);

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/establecimientos/${town}/tipo/${idTipo}`)
      .pipe(map(res => res.data ?? []))
      .subscribe({
        next: (data) => this.establecimientosSubject.next(data),
        error: () => this.establecimientosSubject.next([]),
      });
  }

  // GET todos los tipos
  getTipos(): Observable<any[]> {
    return this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/tipos`)
      .pipe(map(res => res.data ?? []));
  }

  // helper: obtener nombre del tipo por id
  getTipoNombreById(idTipo: number): Observable<string> {
    return this.getTipos().pipe(
      map((tipos: any[]) => {
        const found = (tipos ?? []).find(t => Number(t.id_tipo) === Number(idTipo));
        return String(found?.nombre_tipo ?? 'Tipo');
      })
    );
  }

  // ── Recomendaciones ───────────────────────────────────

  getRecomendaciones(limite = 20): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/recomendaciones/personalizadas?limite=${limite}`,
      this.httpOptions
    );
  }

  getMiPerfil(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/recomendaciones/mi-perfil`,
      this.httpOptions
    );
  }

  refrescarPerfil(): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/recomendaciones/refrescar-perfil`,
      {},
      this.httpOptions
    );
  }

  registrarVisualizacion(idEstablecimiento: number, tiempoSegundos = 0): void {
    this.http.post(
      `${this.baseUrl}/recomendaciones/registrar-visualizacion`,
      {
        id_establecimiento: idEstablecimiento,
        tiempo_visualizacion: tiempoSegundos
      },
      this.httpOptions
    ).subscribe();
  }
}