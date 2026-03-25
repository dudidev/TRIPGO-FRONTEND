import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EnviarMensajeSoporteRequest {
    categoria: string;
    prioridad: string;
    asunto: string;
    descripcion: string;
}

export interface EnviarMensajeSoporteResponse {
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class SoporteService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiBaseUrl}/soporte`;

    enviarMensaje(datos: EnviarMensajeSoporteRequest): Observable<EnviarMensajeSoporteResponse> {
        return this.http.post<EnviarMensajeSoporteResponse>(
            `${this.apiUrl}/enviar`,
            datos
        );
    }
}