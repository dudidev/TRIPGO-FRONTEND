import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ItinerarioItem = {
  id: string;        // usamos string porque tu slug/id viene como string en Detalles
  nombre: string;
  direccion?: string;
  imagenUrl?: string;
};

const STORAGE_KEY = 'tripgo_itinerario_v1';

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

  add(item: ItinerarioItem) {
    const exists = this.items.some(x => x.id === item.id);
    if (exists) return; // evita duplicados

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
    localStorage.removeItem(STORAGE_KEY);
  }

  private save(items: ItinerarioItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  private load(): ItinerarioItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}