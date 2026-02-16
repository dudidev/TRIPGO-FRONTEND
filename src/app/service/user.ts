import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type Role = 'usuario' | 'empresa';


@Injectable({
  providedIn: 'root'
})
export class User {

  private baseUrl = 'http://localhost:4000/api/auth';

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
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

   getRole(): Role | null {
    const user = this.getCurrentUser();
    return user?.rol ?? null;
  }

  isEmpresa(): boolean {
    const user = this.getCurrentUser();
    return user?.rol === 'empresa';
  }
}
