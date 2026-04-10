import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EstablecimientoService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}
  getServiciosByEstablecimiento(id: number) {
  return this.http.get(`${environment.apiBaseUrl}/servicios/${id}`);
}

  getMio(): Observable<any> {
    return this.http.get(`${this.baseUrl}/establecimientos/mio`);
  }

  updateMio(payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/establecimientos/mio`, payload);
  }

  getMios(): Observable<any> {
    return this.http.get(`${this.baseUrl}/establecimientos/mios`);
  }

  updateMioById(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/establecimientos/mios/${id}`, payload);
  }

  getImagenesLugar(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/imagenes/lugares/${id}/imagenes`);
  }

  // ✅ NUEVO: subir imagen
  subirImagenLugar(id: number, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('imagen', archivo);
    return this.http.post(`${this.baseUrl}/imagenes/lugares/${id}/imagenes`, formData);
  }

  // ✅ NUEVO: eliminar imagen
  eliminarImagenLugar(idImagen: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/imagenes/${idImagen}`);
  }

  crear(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/establecimientos`, payload);
  }
}