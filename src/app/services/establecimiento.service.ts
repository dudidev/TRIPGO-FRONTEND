import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class EstablecimientoService {
  private baseUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  // ✅ traer MI establecimiento (empresa logueada)
  getMio(): Observable<any> {
    return this.http.get(`${this.baseUrl}/establecimientos/mio`);
  }

  // ✅ actualizar MI establecimiento (manda payload completo)
  updateMio(payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/establecimientos/mio`, payload);
  }
}
