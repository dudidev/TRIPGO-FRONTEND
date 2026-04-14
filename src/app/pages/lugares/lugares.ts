import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { Api } from '../../api';
import { Subject, takeUntil } from 'rxjs';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader';
import { SharedHeroDirective } from '../../shared/shared-element-hero.directive';
import { StaggerDirective } from '../../shared/stagger.directive';
import { HapticService } from '../../shared/haptic.service';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state';

type CardItem = { slug: string; titulo: string; img: string; };

type ChatMessage = { role: 'user' | 'ai'; text: string; };

@Component({
  selector: 'app-lugares',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,
     Nav, Footer, SkeletonLoaderComponent, SharedHeroDirective,
      StaggerDirective, EmptyStateComponent],
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
  chatOpen = false;
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
    private api: Api,
    private haptic: HapticService
  ) {}

  ngOnInit(): void {
    this.api.establecimientos$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any[]) => {
        this.items = (data ?? [])
          .filter((e: any) => (e.estado ?? 'activo') === 'activo') // 👈 solo activos
          .map((e: any) => ({
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
    toggleChatMobile() {
    this.chatOpen = !this.chatOpen;
  }

  closeChatMobile() {
    this.chatOpen = false;
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
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773601569/mirador_ss0bel.webp',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1771997990/mirador_alto_de_la_cruz_vl62jj.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729538/portada_6_lbjntm.jpg',
      ],
      filandia  : [
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685143/gastronomia_3-_portada_pdxw7k.jpg',
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685143/gastronomia_2-portada_e7tr5m.jpg',
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685143/filandia_1-portada_tu13tg.jpg',
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773676024/comedor_ajyvsc.webp',
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773676025/helena_adentro1_fswy9j.webp',
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773676025/helena_adentro2_mo2adf.webp',
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773676026/la_azotea_filandia_votre8.webp',
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773676025/la_azotea_filandia2_ilxmzt.webp',
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773676025/la_azotea_filandia4_tjxxlh.webp',
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773676026/la_azotea_filandia3_fywvg3.webp',

        ],
      calarca   : [
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733124/amigos_caballiztas_wmm1yd.jpg',
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773339220/jardin-botanico-calarca_qlgdk7.webp',
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773601568/senderismo_ngirma.webp',
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773672478/Cafe-del-Rio-Mirador-calarca-_dnjdwr.webp',
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773672577/cafa-c-del-rio-mirador-calarca_vh3vzm.webp'
        ],
      montenegro: [
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685156/parque_del_cafe3-portada_zhiusk.jpg', 
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685155/Parque_del_cafe_2-portada_d35goj.jpg', 
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685155/Parque_del_cafe_ani4un.jpg', 
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685154/Img_Parque_del_cafe_ruzil0.jpg',
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773675954/parque_los_arrieros_montenegro_mazhgw.webp'
          
        ],
      quimbaya  : [
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773676027/panaca1_montenegro_rmhzhc.webp', 
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773676047/panaca2_montenegro_qicyog.webp', 
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773676048/panaca4_wcyziw.webp', 
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773676048/panaca3_qvq5qz.webp',
          'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773676048/parque_de_los_arrieros_montenegro_le1nxh.webp'
        ],
      circasia  : [
          'https://res.cloudinary.com/dtyvd3fim/image/upload/v1775159898/Circasia5_amvl8a.webp', 
          'https://res.cloudinary.com/dtyvd3fim/image/upload/v1775159896/Circasia1_rp7bma.jpg', 
          'https://res.cloudinary.com/dtyvd3fim/image/upload/v1775159895/Circasia4_edzxye.jpg', 
          'https://res.cloudinary.com/dtyvd3fim/image/upload/v1775159894/Circasia3_ihicl4.jpg',
          'https://res.cloudinary.com/dtyvd3fim/image/upload/v1775159893/Circasia2_j2ae50.jpg'
        ],
      armenia   : ['https://res.cloudinary.com/dtyvd3fim/image/upload/v1775262112/Armenia8_lmk6vq.jpg', 
        'https://res.cloudinary.com/dtyvd3fim/image/upload/v1775261612/Armenia3_cq6fwk.jpg', 
        'https://res.cloudinary.com/dtyvd3fim/image/upload/v1775261612/Armenia6_xeq6px.jpg', ''],
      buenavista: ['https://res.cloudinary.com/dtyvd3fim/image/upload/v1775264959/BV1_mj9mw5.jpg', 
        'https://res.cloudinary.com/dtyvd3fim/image/upload/v1775264987/BV2_dplaga.jpg', 
        'https://res.cloudinary.com/dtyvd3fim/image/upload/v1775264987/BV4_gbp0cw.jpg', ''],
      pijao     : ['https://res.cloudinary.com/dtyvd3fim/image/upload/v1775332519/Pijao3_bggsum.jpg', 
        'https://res.cloudinary.com/dtyvd3fim/image/upload/v1775332518/Pijao2_phonkg.jpg', 
        'https://res.cloudinary.com/dtyvd3fim/image/upload/v1775332519/Pijao1_q9jvz0.jpg', ''],
      cordoba   : ['https://res.cloudinary.com/dtyvd3fim/image/upload/v1775336571/Cordoba1_thyudd.jpg',
         'https://res.cloudinary.com/dtyvd3fim/image/upload/v1775336572/Cordoba2_onlncv.jpg', 
         '', ''],
      tebaida   : ['https://res.cloudinary.com/dtyvd3fim/image/upload/v1775337553/LT1_klkaww.jpg',
         'https://res.cloudinary.com/dtyvd3fim/image/upload/v1775337554/LT4_hxbuzz.jpg',
          'https://res.cloudinary.com/dtyvd3fim/image/upload/v1775337554/LT3_j6skh4.jpg', 
          'https://res.cloudinary.com/dtyvd3fim/image/upload/v1775337556/LT5_s5ujvf.jpg'],
      genova    : ['https://res.cloudinary.com/dtyvd3fim/image/upload/v1775345592/Genova1_do3abl.jpg',
         'https://res.cloudinary.com/dtyvd3fim/image/upload/v1775345592/Genova2_tceb0y.jpg', 
         '', ''],
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
