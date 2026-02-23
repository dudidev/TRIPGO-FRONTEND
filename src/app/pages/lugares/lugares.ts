import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { Api } from '../../api';
import { Subject, takeUntil } from 'rxjs';

type CardItem = {
  slug: string;
  titulo: string;
  img: string;
};

@Component({
  selector: 'app-lugares',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Nav, Footer],
  templateUrl: './lugares.html',
  styleUrl: './lugares.css'
})
export class LugaresComponent implements OnDestroy {
  query = '';

  townSlug = '';
  idTipo = 0;

  tipoNombre = ''; // ✅ para pintar título real

  titulo = 'Establecimientos';
  heroImgs: string[] = [];

  items: CardItem[] = [];
  filtered: CardItem[] = [];

  loading = false;
  errorMsg = '';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: Api
  ) {}

  ngOnInit(): void {
    console.log('✅ LugaresComponent.ngOnInit ejecutado');

    // 1) Suscripción al estado global (evita duplicados con takeUntil)
    this.api.establecimientos$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any[]) => {
          this.items = (data ?? []).map((e: any) => ({
            slug: String(e.id_establecimiento ?? e.id ?? 'sin-id'),
            titulo: e.nombre_establecimiento ?? e.nombre ?? e.direccion ?? 'Sin nombre',
            img: e.imagen ?? 'https://via.placeholder.com/600x400?text=Establecimiento'
          }));

          this.filtered = this.applySearch(this.query);
          this.loading = false;

          if (!this.items.length) {
            this.errorMsg = 'No hay establecimientos registrados para este tipo en este pueblo.';
          } else {
            this.errorMsg = '';
          }
        },
        error: () => {
          this.items = [];
          this.filtered = [];
          this.loading = false;
          this.errorMsg = 'Error cargando establecimientos';
        }
      });

    // 2) Leer parámetros: /lugares/:townSlug/tipo/:idTipo
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.townSlug = params.get('townSlug') || '';
        this.idTipo = Number(params.get('idTipo') || 0);

        if (!this.townSlug || !this.idTipo) {
          this.items = [];
          this.filtered = [];
          this.loading = false;
          this.errorMsg = 'Ruta inválida: falta townSlug o idTipo';
          return;
        }

        // ✅ setear título (tipo + pueblo)
        this.tipoNombre = '';
        this.titulo = `Establecimientos en ${this.townSlug}`;

        // Traer el nombre del tipo desde /tipos (para mostrarlo bonito)
        this.api.getTipoNombreById(this.idTipo)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (nombre) => {
              this.tipoNombre = nombre;
              this.titulo = `${nombre} en ${this.townSlug}`;
            },
            error: () => {
              // si falla, al menos dejamos un título genérico
              this.tipoNombre = '';
            }
          });

        // ✅ Traer filtrado por ubicacion + tipo(id)
        this.loading = true;
        this.errorMsg = '';
        this.items = [];
        this.filtered = [];

        this.api.loadEstablecimientosByTownAndTipoId(this.townSlug, this.idTipo);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch() {
    this.filtered = this.applySearch(this.query);
  }

  private applySearch(query: string): CardItem[] {
    const q = (query ?? '').trim().toLowerCase();
    return !q
      ? [...this.items]
      : this.items.filter(x => x.titulo.toLowerCase().includes(q));
  }

  openItem(item: CardItem) {
    this.router.navigate(['/detalles', item.slug]);
  }
}