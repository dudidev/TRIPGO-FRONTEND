import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EstablecimientoService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // ✅ traer MI establecimiento (uno solo)
  getMio(): Observable<any> {
    return this.http.get(`${this.baseUrl}/establecimientos/mio`);
  }

  // ✅ actualizar MI establecimiento (uno solo)
  updateMio(payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/establecimientos/mio`, payload);
  }

  // ✅ NUEVO: traer TODOS mis establecimientos
  getMios(): Observable<any> {
    return this.http.get(`${this.baseUrl}/establecimientos/mios`);
  }

  // ✅ NUEVO: actualizar un establecimiento mío por ID
  updateMioById(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/establecimientos/mios/${id}`, payload);
  }

  // ✅ crear establecimiento
  crear(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/establecimientos`, payload);
  }
}