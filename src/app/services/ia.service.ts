import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private readonly apiUrl = `${environment.apiBaseUrl}/ia/chatbot`;

  constructor(private http: HttpClient) {}

  preguntarIA(mensaje: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { mensaje });
  }
}