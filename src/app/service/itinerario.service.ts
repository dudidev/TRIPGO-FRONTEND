import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ItinerarioItem = {
  id: string;
  nombre: string;
  direccion?: string;
  imagenUrl?: string;
  id_establecimiento?: number;

  productos?: {
    nombre: string;
    precio: number;
    categoria: string;
    cantidad?: number;
  }[];
};

@Injectable({ providedIn: 'root' })
export class ItinerarioService {


  private subject = new BehaviorSubject<ItinerarioItem[]>(this.load());
  items$ = this.subject.asObservable();


  get items(): ItinerarioItem[] {
    return this.subject.value;
  }

  get count(): number {
    return this.items.length;
  }

  private getStorageKey(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return `tripgo_itinerario_${user?.id || 'anon'}`;
  }


  add(item: ItinerarioItem) {

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user?.id) {
      console.log(" Usuario no autenticado, no se guarda itinerario");
      return;
    }

    const exists = this.items.some(x => x.id === item.id);
    if (exists) return;

    const updated = [item, ...this.items];
    this.subject.next(updated);
    this.save(updated);
  }


  remove(id: string) {
    const updated = this.items.filter(x => x.id !== id);
    this.subject.next(updated);
    this.save(updated);
  }


  clear() {
    this.subject.next([]);
    localStorage.removeItem(this.getStorageKey());
  }

 
  reload() {
    this.subject.next(this.load());
  }


  private save(items: ItinerarioItem[]) {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(items));
  }


  private load(): ItinerarioItem[] {
    try {
      const raw = localStorage.getItem(this.getStorageKey());
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}