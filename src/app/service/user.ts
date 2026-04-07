import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export type Role = 'usuario' | 'empresa';

@Injectable({
  providedIn: 'root'
})
export class User {

  // Ahora toma la URL desde environment
  private baseUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient) {}

  register(data: {
    nombre_usuario: string;
    correo_usuario: string;
    password_u: string;
    rol?: Role;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: {
    correo_usuario: string;
    password_u: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data)
  }

  
}