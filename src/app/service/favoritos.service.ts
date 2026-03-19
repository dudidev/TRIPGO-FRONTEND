import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from './user';
import { environment } from '../../environments/environment';

export type FavoritoItem = {
  id: string;
  nombre: string;
  direccion: string;
  imagenUrl?: string;
};

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private baseUrl = environment.apiBaseUrl;

  constructor(
    private userService: User,
    private http: HttpClient
  ) {}

  private getCurrentUserId(): string | null {
    const user = this.userService.getCurrentUser();
    if (!user) return null;
    return String(user.id);
  }

  // ── Obtener todos los favoritos del usuario ───────────────────
  getFavoritosDesdeBackend(): Observable<FavoritoItem[]> {
    const userId = this.getCurrentUserId();
    if (!userId) return of([]);

    return this.http.get<any[]>(`${this.baseUrl}/favoritos/${userId}`).pipe(
      map(data => data.map(f => ({
        id       : String(f.id_establecimiento),
        nombre   : f.nombre_establecimiento ?? '',
        direccion: f.direccion ?? '',
        imagenUrl: f.imagenUrl ?? undefined
      }))),
      catchError(() => of([]))
    );
  }

  // ── Verificar si un lugar es favorito ─────────────────────────
  isFavorito(lugarId: string): boolean {
    // Como ahora es async, esto se usa solo como cache local en memoria
    return this._cacheFavoritos.has(String(lugarId));
  }

  // Cache en memoria para isFavorito sincrónico
  private _cacheFavoritos = new Set<string>();

  cargarCacheDesdeBackend(): void {
    const userId = this.getCurrentUserId();
    if (!userId) return;

    this.http.get<any[]>(`${this.baseUrl}/favoritos/${userId}`).pipe(
      catchError(() => of([]))
    ).subscribe(data => {
      this._cacheFavoritos.clear();
      data.forEach(f => this._cacheFavoritos.add(String(f.id_establecimiento)));
    });
  }

  // ── Agregar favorito ──────────────────────────────────────────
  addFavorito(item: FavoritoItem): Observable<boolean> {
    const userId = this.getCurrentUserId();
    if (!userId) return of(false);

    return this.http.post(`${this.baseUrl}/favoritos`, {
      id_usuario         : Number(userId),
      id_establecimiento : Number(item.id)
    }).pipe(
      map(() => {
        this._cacheFavoritos.add(String(item.id));
        return true;
      }),
      catchError(() => of(false))
    );
  }

  // ── Eliminar favorito ─────────────────────────────────────────
  removeFavorito(lugarId: string): Observable<boolean> {
    const userId = this.getCurrentUserId();
    if (!userId) return of(false);

    return this.http.delete(`${this.baseUrl}/favoritos/${userId}/${lugarId}`).pipe(
      map(() => {
        this._cacheFavoritos.delete(String(lugarId));
        return true;
      }),
      catchError(() => of(false))
    );
  }

  // ── Toggle favorito ───────────────────────────────────────────
  toggleFavorito(item: FavoritoItem): Observable<boolean> {
    if (this.isFavorito(item.id)) {
      return this.removeFavorito(item.id).pipe(map(() => false));
    }
    return this.addFavorito(item).pipe(map(() => true));
  }
}