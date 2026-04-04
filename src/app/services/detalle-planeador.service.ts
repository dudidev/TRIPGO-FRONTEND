import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetallePlaneadorService {

  private apiUrl = 'http://localhost:3000/detalles';

  constructor(private http: HttpClient) {}

  // ➕ Agregar servicio al planeador
  agregarDetalle(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // 📥 Obtener todos los detalles de un planeador
  obtenerDetalles(id_planeador: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id_planeador}`);
  }

  // 🔁 Actualizar cantidad (para después)
  actualizarCantidad(id: number, cantidad: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { cantidad });
  }

  // 🗑 Eliminar (cuando cantidad = 0)
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}