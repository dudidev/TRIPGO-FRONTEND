import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { AiService } from '../../services/ia.service';

type ChatMessage = {
  role: 'user' | 'ai';
  text: string;
};

@Component({
  selector: 'app-chat-flotante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-flotante.html',
  styleUrl: './chat-flotante.css'
})
export class ChatFlotante implements AfterViewChecked, OnInit, OnDestroy {

  @ViewChild('chatBox') chatBox!: ElementRef;

  chatOpen = false;
  aiQuery = '';
  aiLoading = false;

  private shouldScrollChat = false;
  private routerSub!: Subscription;

  chatMessages: ChatMessage[] = [
    {
      role: 'ai',
      text: '¡Hola! Soy TritanIA, tu asistente de viaje TripGo. ¿Qué tipo de experiencia buscas hoy? 🌿'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private aiService: AiService
  ) { }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (!this.isLoggedIn) {
          this.chatOpen = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollChat) {
      this.scrollChatToBottom();
      this.shouldScrollChat = false;
    }
  }

  toggleChat(event?: Event): void {
    event?.stopPropagation();
    this.chatOpen = !this.chatOpen;
  }

  closeChat(): void {
    this.chatOpen = false;
  }

  askAI(prompt: string): void {
    this.aiQuery = prompt;
    this.sendMessage();
  }

  sendMessage(): void {
    const text = this.aiQuery.trim();

    if (!text || this.aiLoading) return;

    this.chatMessages.push({
      role: 'user',
      text
    });

    this.aiQuery = '';
    this.aiLoading = true;
    this.shouldScrollChat = true;

    this.aiService.preguntarIA(text).subscribe({
      next: (response: any) => {
        console.log('Respuesta chatbot:', response);

        let aiText = '';

        if (response?.tipo === 'mensaje') {
          aiText = response.mensaje;
        }

        else if (
          response?.tipo === 'resultados' &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          aiText = 'OK! Te entiendo, entonces te recomiendo estos lugares:\n\n';

          response.data.forEach((l: any) => {
            aiText += `• ${l.nombre_establecimiento} (${l.nombre_tipo})\n`;
          });
        }

        else {
          aiText =
            'No encontré resultados para esa búsqueda. Intenta con otra ubicación o tipo de lugar.';
        }

        this.chatMessages.push({
          role: 'ai',
          text: aiText
        });

        this.aiLoading = false;
        this.shouldScrollChat = true;
      },

      error: () => {
        this.chatMessages.push({
          role: 'ai',
          text: 'Hubo un error conectando con TritanIA. Intenta de nuevo. 😕'
        });

        this.aiLoading = false;
        this.shouldScrollChat = true;
      }
    });
  }

  private scrollChatToBottom(): void {
    try {
      if (this.chatBox?.nativeElement) {
        this.chatBox.nativeElement.scrollTop =
          this.chatBox.nativeElement.scrollHeight;
      }
    } catch { }
  }
}