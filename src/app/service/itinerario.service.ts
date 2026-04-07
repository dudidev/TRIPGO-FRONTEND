import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../services/auth.service';

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

  private authService = inject(AuthService);

  private subject = new BehaviorSubject<ItinerarioItem[]>([]);
  items$ = this.subject.asObservable();

  constructor() {
    // ✅ Solo cargamos si hay usuario autenticado al iniciar
    // Si no hay sesión aún (cookie pendiente de validar), esperamos al reload() del login
    const user = this.authService.getCurrentUser();
    if (user?.id) {
      this.subject.next(this.load());
    }
  }

  get items(): ItinerarioItem[] {
    return this.subject.value;
  }

  get count(): number {
    return this.items.length;
  }

  private getStorageKey(): string {
    const user = this.authService.getCurrentUser();
    // ✅ Sin usuario autenticado no generamos key de anon — evita mezclar datos
    if (!user?.id) return '';
    return `tripgo_itinerario_${user.id}`;
  }

  add(item: ItinerarioItem) {
    const user = this.authService.getCurrentUser();

    if (!user?.id) {
      console.warn('[ItinerarioService] Usuario no autenticado, no se guarda itinerario');
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
    const key = this.getStorageKey();
    this.subject.next([]);
    // ✅ Solo limpia si hay key válida (usuario autenticado)
    if (key) localStorage.removeItem(key);
  }

  // ✅ Llamado desde login — recarga con la key del usuario recién autenticado
  reload() {
    this.subject.next(this.load());
  }

  private save(items: ItinerarioItem[]) {
    const key = this.getStorageKey();
    // ✅ No guardar si no hay key válida
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(items));
  }

  private load(): ItinerarioItem[] {
    const key = this.getStorageKey();
    if (!key) return [];
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}