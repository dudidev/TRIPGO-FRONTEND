import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { environment } from '../../../environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { Api } from '../../api';

type Recomendacion = {
  id_establecimiento : number;
  nombre_establecimiento: string;
  tipo               : number;
  nombre_tipo        : string;
  ubicacion          : string;
  direccion?         : string;
  calificacion_promedio: number;
  total_resenas      : number;
  descripcion?       : string;
  imagen?            : string;
  score_relevancia   : number;
  razon              : string;
};

type TipoFavorito = {
  id_tipo    : number;
  nombre_tipo: string;
  score      : number;
};

type Perfil = {
  tipos_favoritos              : TipoFavorito[];
  ubicaciones_favoritas        : { ubicacion: string; visitas: number }[];
  promedio_calificaciones_dadas: number;
  total_interacciones          : number;
};

@Component({
  selector   : 'app-recomendaciones',
  standalone : true,
  imports    : [CommonModule, RouterModule, Nav, Footer],
  templateUrl: './recomendaciones.html',
  styleUrl   : './recomendaciones.css',
})
export class Recomendaciones implements OnInit, OnDestroy {

  recomendaciones : Recomendacion[] = [];
  perfil          : Perfil | null   = null;
  loading         = true;
  loadingPerfil   = true;
  error           = '';

  private destroy$ = new Subject<void>();
  private apiUrl   = environment.apiBaseUrl;

  constructor(
    private http  : HttpClient,
    private router: Router,
    private api   : Api
  ) {}

  ngOnInit(): void {
    this.cargarTodo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Getters de conveniencia ───────────────────────────────────

  get nombreUsuario(): string {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')?.nombre_usuario?.split(' ')[0] ?? 'Viajero';
    } catch { return 'Viajero'; }
  }

  get destacado(): Recomendacion | null {
    return this.recomendaciones[0] ?? null;
  }

  get porBusquedas(): Recomendacion[] {
    return this.recomendaciones
      .filter(r => r.razon?.toLowerCase().includes('buscast') || r.razon?.toLowerCase().includes('buscaste'))
      .slice(0, 4);
  }

  get porVisitas(): Recomendacion[] {
    return this.recomendaciones
      .filter(r =>
        r.razon?.toLowerCase().includes('visitaste') ||
        r.razon?.toLowerCase().includes('visualiz') ||
        r.razon?.toLowerCase().includes('min viendo') ||
        r.razon?.toLowerCase().includes('calificaste')
      )
      .slice(0, 4);
  }

  get otrasRecs(): Recomendacion[] {
    const usados = new Set([
      this.destacado?.id_establecimiento,
      ...this.porBusquedas.map(r => r.id_establecimiento),
      ...this.porVisitas.map(r => r.id_establecimiento),
    ]);
    return this.recomendaciones.filter(r => !usados.has(r.id_establecimiento)).slice(0, 6);
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

  // ── Navegación ────────────────────────────────────────────────
  irADetalle(rec: Recomendacion): void {
    this.router.navigate(['/detalles', rec.id_establecimiento]);
  }

  // ── Carga de datos ────────────────────────────────────────────
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

 private cargarTodo(): void {
  this.loading       = true;
  this.loadingPerfil = true;
  this.error         = '';

  this.api.getRecomendaciones(20)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        this.recomendaciones = data.recomendaciones ?? [];
        this.loading = false;
      },
      error: () => {
        this.error   = 'No pudimos cargar tus recomendaciones.';
        this.loading = false;
      }
    });

  this.api.getMiPerfil()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        this.perfil        = data;
        this.loadingPerfil = false;
      },
      error: () => { this.loadingPerfil = false; }
    });
}

refrescarPerfil(): void {
  this.api.refrescarPerfil()
    .pipe(takeUntil(this.destroy$))
    .subscribe({ next: () => this.cargarTodo() });
}


  // ── Helpers template ─────────────────────────────────────────
  starsArray(n: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  truncar(texto: string, max: number): string {
    if (!texto) return '';
    return texto.length > max ? texto.slice(0, max) + '…' : texto;
  }
}
