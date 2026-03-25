import { Component, ViewChild, ElementRef, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';

type ChatMessage = { role: 'user' | 'ai'; text: string; };

@Component({
  selector: 'app-chat-flotante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-flotante.html',
  styleUrl: './chat-flotante.css'
})
export class ChatFlotante implements AfterViewChecked, OnInit, OnDestroy {

  @ViewChild('chatBox') chatBox!: ElementRef;

  isLoggedIn = false;
  chatOpen = false;
  aiQuery = '';
  aiLoading = false;
  private shouldScrollChat = false;
  private routerSub!: Subscription;
  private storageListener!: EventListener;

  chatMessages: ChatMessage[] = [
    { role: 'ai', text: '¡Hola! Soy tu asistente de viaje TripGo. ¿Qué tipo de experiencia buscas hoy? 🌿' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Re-verifica en cada cambio de ruta
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.checkAuth());

    // Re-verifica si cambia localStorage (login/logout)
    this.storageListener = () => this.checkAuth();
    window.addEventListener('storage', this.storageListener);

    // Verificación inicial
    this.checkAuth();
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    window.removeEventListener('storage', this.storageListener);
  }

  private checkAuth(): void {
    this.isLoggedIn = !!localStorage.getItem('token');
    if (!this.isLoggedIn) this.chatOpen = false;
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollChat) {
      this.scrollChatToBottom();
      this.shouldScrollChat = false;
    }
  }

  toggleChat(event?: Event): void {
    if (event) event.stopPropagation();
    this.chatOpen = !this.chatOpen;
  }

  closeChat(): void {
    this.chatOpen = false;
  }

  askAI(prompt: string): void {
    this.aiQuery = prompt;
    this.sendMessage();
  }

  async sendMessage(): Promise<void> {
    const text = this.aiQuery.trim();
    if (!text || this.aiLoading) return;

    this.chatMessages.push({ role: 'user', text });
    this.aiQuery = '';
    this.aiLoading = true;
    this.shouldScrollChat = true;

    try {
      const response = await fetch('https://tripgo-backend-arehbhbubshxdpg7.chilecentral-01.azurewebsites.net/ia/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: text })
      });

      const lugares = await response.json();
      let aiText = '';

      if (!lugares || lugares.length === 0) {
        aiText = 'No encontré lugares con esa búsqueda. Intenta con otro término. 🗺️';
      } else {
        aiText = 'Te recomiendo estos lugares:\n\n';
        lugares.forEach((l: any) => {
          aiText += `• ${l.nombre_establecimiento} (${l.nombre_tipo})\n`;
        });
      }

      this.chatMessages.push({ role: 'ai', text: aiText });
    } catch {
      this.chatMessages.push({ role: 'ai', text: 'Hubo un error conectando con la IA. Intenta de nuevo. 😕' });
    }

    this.aiLoading = false;
    this.shouldScrollChat = true;
  }

  private scrollChatToBottom(): void {
    try {
      if (this.chatBox?.nativeElement)
        this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    } catch {}
  }
}