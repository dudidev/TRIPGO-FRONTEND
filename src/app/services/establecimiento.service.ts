import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EstablecimientoService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // ✅ traer MI establecimiento (empresa logueada)
  getMio(): Observable<any> {
    return this.http.get(`${this.baseUrl}/establecimientos/mio`);
  }

  // ✅ actualizar MI establecimiento
  updateMio(payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/establecimientos/mio`, payload);
  }

  // ✅ crear establecimiento (cuando aún no existe)
  crear(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/establecimientos`, payload);
  }
}