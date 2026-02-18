import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { LUGARES_DATA } from '../../data/lugares.data';

type CardItem = {
  slug: string;
  titulo: string;
  img: string;
};


type LugaresData = {
  titulo: string;      
  heroImgs: string[];
  items: CardItem[];
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
  categoryKey = '';

 
  titulo = '';
  heroImgs: string[] = [];
  items: CardItem[] = [];
  filtered: CardItem[] = [];

  heroIndex = 0;
  private timerId: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
     
      this.townSlug = params.get('townSlug') || '';
      this.categoryKey = params.get('categoryKey') || '';

      const data = LUGARES_DATA[this.townSlug]?.[this.categoryKey];

     
      if (!data) {
        this.titulo = 'No hay lugares para esta categoría aún';
        this.heroImgs = [];
        this.items = [];
        this.filtered = [];
        this.stopHero();
        return;
      }

      this.titulo = data.titulo;
      this.heroImgs = data.heroImgs;
      this.items = data.items;
      this.filtered = [...this.items];

      // reinicia slider
      this.heroIndex = 0;
      this.startHero();
    });
  }

  ngOnDestroy(): void {
    this.stopHero();
  }

  private stopHero() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = null;
  }

  startHero() {
    this.stopHero();
    if (!this.heroImgs.length) return;

    this.timerId = setInterval(() => {
      this.heroIndex = (this.heroIndex + 1) % this.heroImgs.length;
    }, 3500);
  }

  onSearch() {
    const q = this.query.trim().toLowerCase();
    this.filtered = !q
      ? [...this.items]
      : this.items.filter(x => x.titulo.toLowerCase().includes(q));
  }

  // NAVEGACIÓN FUNCIONAL
  openItem(item: CardItem) {
    this.router.navigate(['/detalles', item.slug]);
  }
}
