import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private apiUrl = 'https://tripgo-backend-arehbhbubshxdpg7.chilecentral-01.azurewebsites.net/ia/chatbot'

  constructor(private http: HttpClient) {}

  preguntarIA(mensaje: string): Observable<any> {
    return this.http.post(this.apiUrl, { mensaje })
  }

}