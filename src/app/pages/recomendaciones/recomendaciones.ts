import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { environment } from '../../../environments/environment';
import { Subject, takeUntil, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Api } from '../../api';
import { EstablecimientoService } from '../../services/establecimiento.service';
import { AuthService } from '../../services/auth.service';

type Recomendacion = {
  id_establecimiento: number;
  nombre_establecimiento: string;
  tipo: number;
  nombre_tipo: string;
  ubicacion: string;
  direccion?: string;
  calificacion_promedio: number;
  total_resenas: number;
  descripcion?: string;
  imagen?: string;
  score_relevancia: number;
  razon: string;
};

type TipoFavorito = {
  id_tipo: number;
  nombre_tipo: string;
  score: number;
};

type Perfil = {
  tipos_favoritos: TipoFavorito[];
  ubicaciones_favoritas: { ubicacion: string; visitas: number }[];
  promedio_calificaciones_dadas: number;
  total_interacciones: number;
};

type HeroSlide = {
  nombre: string;
  ubicacion: string;
  imagen?: string;
};

@Component({
  selector: 'app-recomendaciones',
  standalone: true,
  imports: [CommonModule, RouterModule, Nav, Footer],
  templateUrl: './recomendaciones.html',
  styleUrl: './recomendaciones.css',
})
export class Recomendaciones implements OnInit, OnDestroy {

  recomendaciones: Recomendacion[] = [];
  perfil: Perfil | null = null;

  loading = true;
  loadingPerfil = true;
  error = '';

  heroSlides: HeroSlide[] = [];
  slideActual = 0;
  fadeTexto = false;
  private sliderTimer: any = null;

  private destroy$ = new Subject<void>();
  private apiUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private api: Api,
    private establecimientoService: EstablecimientoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarTodo();
  }

  ngOnDestroy(): void {
    this.pararSlider();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── GETTERS ─────────────────────────

  // ✅ Reemplazar el getter nombreUsuario
get nombreUsuario(): string {
  return this.authService.getCurrentUser()?.nombre_usuario?.split(' ')[0] ?? 'Viajero';
}

  get destacado(): Recomendacion | null {
    return this.recomendaciones[0] ?? null;
  }

  get porBusquedas(): Recomendacion[] {
    return this.recomendaciones
      .filter(r => r.razon?.toLowerCase().includes('busc'))
      .slice(0, 4);
  }

  get porVisitas(): Recomendacion[] {
    return this.recomendaciones
      .filter(r =>
        r.razon?.toLowerCase().includes('visit') ||
        r.razon?.toLowerCase().includes('visual') ||
        r.razon?.toLowerCase().includes('viendo') ||
        r.razon?.toLowerCase().includes('calific')
      )
      .slice(0, 4);
  }

  get otrasRecs(): Recomendacion[] {
    const usados = new Set([
      this.destacado?.id_establecimiento,
      ...this.porBusquedas.map(r => r.id_establecimiento),
      ...this.porVisitas.map(r => r.id_establecimiento),
    ]);

    return this.recomendaciones
      .filter(r => !usados.has(r.id_establecimiento))
      .slice(0, 6);
  }

  get interesesPills(): TipoFavorito[] {
    return (this.perfil?.tipos_favoritos ?? []).slice(0, 5);
  }

  get maxScore(): number {
    const scores = this.perfil?.tipos_favoritos.map(t => t.score) ?? [1];
    return Math.max(...scores, 1);
  }

  getBarWidth(score: number): number {
    return Math.round((score / this.maxScore) * 100);
  }

  getBarColor(index: number): string {
    const colors = ['#E27921', '#0E6973', '#534AB7', '#888780'];
    return colors[index % colors.length];
  }

  getThumbColor(index: number): string {
    const colors = ['#0E6973', '#534AB7', '#854F0B', '#3B6D11', '#993556'];
    return colors[index % colors.length];
  }

  // ── HERO ─────────────────────────

  private construirHero(): void {
    if (!this.recomendaciones.length) {
      this.heroSlides = [{
        nombre: 'Quindío',
        ubicacion: 'Colombia',
        imagen: ''
      }];
      return;
    }

    const conImagen = this.recomendaciones.filter(r => r.imagen);
    const sinImagen = this.recomendaciones.filter(r => !r.imagen);

    const base = [...conImagen, ...sinImagen].slice(0, 5);

    this.heroSlides = base.map(r => ({
      nombre: r.nombre_establecimiento,
      ubicacion: r.ubicacion,
      imagen: r.imagen || ''
    }));
  }

  private iniciarSlider(): void {
    this.pararSlider();

    if (this.heroSlides.length <= 1) return;

    this.sliderTimer = setInterval(() => {
      this.avanzarSlide();
    }, 4500);
  }

  private pararSlider(): void {
    if (this.sliderTimer) {
      clearInterval(this.sliderTimer);
      this.sliderTimer = null;
    }
  }

  pausarSlider(): void {
    this.pararSlider();
  }

  reanudarSlider(): void {
    this.iniciarSlider();
  }

  private avanzarSlide(): void {
    const next = (this.slideActual + 1) % this.heroSlides.length;
    this.cambiarSlide(next);
  }

  irASlide(index: number): void {
    if (index === this.slideActual) return;

    this.cambiarSlide(index);
    this.pararSlider();
    this.iniciarSlider();
  }

  private cambiarSlide(index: number): void {
    this.fadeTexto = true;

    setTimeout(() => {
      this.slideActual = index;
      this.fadeTexto = false;
    }, 300);
  }

  // ── NAV ─────────────────────────

  irADetalle(rec: Recomendacion): void {
    this.router.navigate(['/detalles', rec.id_establecimiento]);
  }

  // ── DATA ─────────────────────────

  private cargarTodo(): void {
    this.loading = true;
    this.loadingPerfil = true;
    this.error = '';

    this.api.getRecomendaciones(20)
      .pipe(
        takeUntil(this.destroy$),
        switchMap((data: any) => {
          const base = data.recomendaciones ?? [];

          if (!base.length) return of(base);

          const requests = base.map((rec: Recomendacion) =>
            this.establecimientoService.getImagenesLugar(rec.id_establecimiento).pipe(
              map((resp: any) => {
                const img = resp?.imagenes?.[0]?.url ?? '';
                return { ...rec, imagen: img };
              }),
              catchError(() => of({ ...rec, imagen: '' }))
            )
          );

          return forkJoin(requests);
        })
      )
      .subscribe({
        next: (recs) => {
          this.recomendaciones = recs;

          // 🔥 AQUÍ SE CONECTA EL HERO
          this.construirHero();
          this.iniciarSlider();

          this.loading = false;
        },
        error: () => {
          this.error = 'No pudimos cargar tus recomendaciones.';
          this.loading = false;
        }
      });

    this.api.getMiPerfil()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.perfil = data;
          this.loadingPerfil = false;
        },
        error: () => {
          this.loadingPerfil = false;
        }
      });
  }

  refrescarPerfil(): void {
    this.api.refrescarPerfil()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.cargarTodo()
      });
  }

  // ── HELPERS ─────────────────────────

  starsArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  truncar(texto: string, max: number): string {
    if (!texto) return '';
    return texto.length > max ? texto.slice(0, max) + '…' : texto;
  }
}