import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { Api } from '../../api';

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
export class LugaresComponent {
  query = '';

  townSlug = '';
  idTipo = 0;

  // ✅ ahora el “título” lo puedes setear desde el tipo seleccionado (si quieres)
  titulo = 'Establecimientos';
  heroImgs: string[] = []; // si no usas hero dinámico, lo puedes dejar vacío

  items: CardItem[] = [];
  filtered: CardItem[] = [];

  loading = false;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: Api
  ) {}

  ngOnInit(): void {
    console.log('✅ LugaresComponent.ngOnInit ejecutado');

    // 1) Suscripción al estado global
    this.api.establecimientos$.subscribe({
      next: (data: any[]) => {
        this.items = (data ?? []).map((e: any) => ({
          slug: String(e.id_establecimiento ?? e.id ?? 'sin-id'),
          titulo: e.nombre_establecimiento ?? e.nombre ?? e.direccion ?? 'Sin nombre',
          img: e.imagen ?? 'https://via.placeholder.com/600x400?text=Establecimiento'
        }));

        this.filtered = this.applySearch(this.query);
        this.loading = false;
        this.errorMsg = '';
      },
      error: () => {
        this.items = [];
        this.filtered = [];
        this.loading = false;
        this.errorMsg = 'Error cargando establecimientos';
      }
    });

    // 2) Leer parámetros: /lugares/:townSlug/tipo/:idTipo
    this.route.paramMap.subscribe(params => {
      this.townSlug = params.get('townSlug') || '';
      this.idTipo = Number(params.get('idTipo') || 0);

      if (!this.townSlug || !this.idTipo) {
        this.items = [];
        this.filtered = [];
        this.loading = false;
        this.errorMsg = 'Ruta inválida: falta townSlug o idTipo';
        return;
      }

      // ✅ Traer filtrado por ubicacion + tipo(id)
      this.loading = true;
      this.errorMsg = '';
      this.items = [];
      this.filtered = [];

      this.api.loadEstablecimientosByTownAndTipoId(this.townSlug, this.idTipo);
    });
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