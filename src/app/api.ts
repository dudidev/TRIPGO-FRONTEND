import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export type ApiResponse<T> = {
  ok: boolean;
  data: T;
  error?: any;
};

export type Ubicacion = {
  id_destinos?: number;
  nombre_ciudad: string;
  departamento?: string;
  descripcion?: string;
};

@Injectable({
  providedIn: 'root'
})
export class Api {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getUbicaciones(): Observable<Ubicacion[]> {
    return this.http
      .get<ApiResponse<Ubicacion[]>>(`${this.baseUrl}/ubicaciones`)
      .pipe(map(res => res.data ?? []));
  }

  // Si luego las necesitas en Categorias/Cabalgata:
  getTipos(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/tipos`).pipe(
      map(res => res.data ?? [])
    );
  }

  getServicios(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/servicios`).pipe(
      map(res => res.data ?? [])
    );
  }

  getEstablecimientos(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/establecimientos`).pipe(
      map(res => res.data ?? [])
    );
  }
}
