import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

private api = "https://tripgo-backend-arehbhbubshxdpg7.chilecentral-01.azurewebsites.net/usuarios";  constructor(private http: HttpClient) {}

  obtenerUsuario(id:number):Observable<any>{
    return this.http.get(`${this.api}/${id}`);
  }

  actualizarUsuario(id:number, data:any):Observable<any>{
    return this.http.put(`${this.api}/${id}`, data);
  }

  actualizarFotoPerfil(id: number, data: FormData) {
  return this.http.put(`${this.api}/${id}/foto`, data);
}

}