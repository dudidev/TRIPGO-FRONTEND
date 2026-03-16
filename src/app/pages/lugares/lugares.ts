import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { Api } from '../../api';
import { Subject, takeUntil } from 'rxjs';

type CardItem = { slug: string; titulo: string; img: string; };

type ChatMessage = { role: 'user' | 'ai'; text: string; };

@Component({
  selector: 'app-lugares',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Nav, Footer],
  templateUrl: './lugares.html',
  styleUrl: './lugares.css'
})
export class LugaresComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('chatBox') chatBox!: ElementRef;

  query    = '';
  townSlug = '';
  idTipo   = 0;
  titulo   = 'Establecimientos';

  heroImgs  : string[] = [];
  heroIndex = 0;
  private heroTimerId: any = null;

  items    : CardItem[] = [];
  filtered : CardItem[] = [];
  loading  = false;
  errorMsg = '';

  // ── AI Chat ──────────────────────────────
  aiQuery      = '';
  aiLoading    = false;
  showProModal = false;
  chatMessages : ChatMessage[] = [
    { role: 'ai', text: '¡Hola! Soy tu asistente de viaje. Cuéntame qué tipo de plan buscas y te recomiendo los mejores lugares. 🌿' }
  ];
  private shouldScrollChat = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: Api
  ) {}

  ngOnInit(): void {
    this.api.establecimientos$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any[]) => {
          this.items = (data ?? []).map((e: any) => ({
            slug  : String(e.id_establecimiento ?? e.id ?? 'sin-id'),
            titulo: e.nombre_establecimiento ?? e.nombre ?? e.direccion ?? 'Sin nombre',
            img   : e.imagen ?? null
          }));
          this.filtered = this.applySearch(this.query);
          this.loading  = false;
          this.errorMsg = !this.items.length
            ? 'No hay establecimientos registrados para este tipo en este pueblo.'
            : '';
        },
        error: () => {
          this.items = []; this.filtered = [];
          this.loading = false;
          this.errorMsg = 'Error cargando establecimientos';
        }
      });

    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.townSlug = params.get('townSlug') || '';
        this.idTipo   = Number(params.get('idTipo') || 0);
        this.setHeroByTownSlug(this.townSlug);

        if (!this.townSlug || !this.idTipo) {
          this.items = []; this.filtered = [];
          this.loading = false;
          this.errorMsg = 'Ruta inválida: falta townSlug o idTipo';
          return;
        }

        this.loading = true;
        this.errorMsg = '';
        this.items = []; this.filtered = [];
        this.query = '';
        this.titulo = `Establecimientos en ${this.townSlug}`;

        this.api.getTipoNombreById(this.idTipo)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next : (nombre) => { this.titulo = `${nombre} en ${this.townSlug}`; },
            error: ()       => { this.titulo = `Establecimientos en ${this.townSlug}`; }
          });

        this.api.loadEstablecimientosByTownAndTipoId(this.townSlug, this.idTipo);
      });
  }

  ngOnDestroy(): void {
    this.stopHero();
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollChat) {
      this.scrollChatToBottom();
      this.shouldScrollChat = false;
    }
  }

  // ── AI Chat ──────────────────────────────────────────────────────────────

  /** Llamado desde los botones de planes rápidos */
  askAI(prompt: string): void {
    this.aiQuery = prompt;
    this.sendAIMessage();
  }

  onAiInputFocus(): void {
  const isProUser = false; // reemplaza con tu lógica de auth
  if (!isProUser) {
    this.showProModal = true;
  }
}

  async sendAIMessage(): Promise<void> {
    const text = this.aiQuery.trim();
    if (!text || this.aiLoading) return;

    this.chatMessages.push({ role: 'user', text });
    this.aiQuery      = '';
    this.aiLoading    = true;
    this.shouldScrollChat = true;

    // Construye contexto con los lugares actualmente visibles
    const lugaresCtx = this.filtered.slice(0, 20).map(i => i.titulo).join(', ');
    const systemPrompt = `Eres un asistente de viaje especialista en el Eje Cafetero colombiano, específicamente en ${this.townSlug}, Quindío.
Los establecimientos disponibles actualmente en la categoría "${this.titulo}" son: ${lugaresCtx || 'varios lugares locales'}.
Responde siempre en español, de forma breve (máximo 3-4 oraciones), amigable y concreta. 
Si recomiendas lugares, menciona nombres de los establecimientos disponibles cuando sea relevante.
No uses markdown, no uses asteriscos ni listas con guiones. Habla de forma natural.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({
          model     : 'claude-sonnet-4-20250514',
          max_tokens: 300,
          system    : systemPrompt,
          messages  : [
            ...this.chatMessages
              .filter(m => m.role !== 'ai' || this.chatMessages.indexOf(m) > 0)
              .slice(-6)
              .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
            { role: 'user', content: text }
          ]
        })
      });

      const data = await response.json();
      const aiText = data?.content?.[0]?.text ?? 'No pude generar una respuesta. Intenta de nuevo.';
      this.chatMessages.push({ role: 'ai', text: aiText });

    } catch {
      this.chatMessages.push({ role: 'ai', text: 'Hubo un error al conectar con la IA. Intenta de nuevo más tarde.' });
    }

    this.aiLoading    = false;
    this.shouldScrollChat = true;
  }

  private scrollChatToBottom(): void {
    try {
      if (this.chatBox?.nativeElement) {
        this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
      }
    } catch {}
  }

  // ── Search ───────────────────────────────────────────────────────────────

  onSearch(): void {
    this.filtered = this.applySearch(this.query);
  }

  private applySearch(query: string): CardItem[] {
    const q = (query ?? '').trim().toLowerCase();
    return !q ? [...this.items] : this.items.filter(x => x.titulo.toLowerCase().includes(q));
  }

  openItem(item: CardItem): void {
    this.router.navigate(['/detalles', item.slug], {
      queryParams: { townSlug: this.townSlug, idTipo: this.idTipo }
    });
  }

  // ── Hero ─────────────────────────────────────────────────────────────────

  private setHeroByTownSlug(townSlug: string): void {
    const t = (townSlug || '').toLowerCase().trim();
    const heroMap: Record<string, string[]> = {
      salento: [
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765732081/cabalgata_portada_-_5_xjw3xq.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729542/portada_8_jrmbd6.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731463/cabalgata_-_portada_4_dma1bo.jpg'
      ],
      filandia  : ['', '', ''],
      calarca   : ['', '', ''],
      montenegro: ['', '', ''],
      quimbaya  : ['', '', ''],
      circasia  : ['', '', ''],
      armenia   : ['', '', ''],
      buenavista: ['', '', ''],
      pijao     : ['', '', ''],
      cordoba   : ['', '', ''],
      tebaida   : ['', '', ''],
      genova    : ['', '', ''],
    };

    this.heroImgs  = heroMap[t]?.filter(Boolean) ?? [];
    this.heroIndex = 0;
    this.heroImgs.length ? this.startHero() : this.stopHero();
  }

  private startHero(): void {
    this.stopHero();
    if (this.heroImgs.length <= 1) return;
    this.heroTimerId = setInterval(() => {
      this.heroIndex = (this.heroIndex + 1) % this.heroImgs.length;
    }, 3500);
  }

  private stopHero(): void {
    if (this.heroTimerId) clearInterval(this.heroTimerId);
    this.heroTimerId = null;
  }
}
