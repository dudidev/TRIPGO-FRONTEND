import { Injectable } from '@angular/core';
import { User } from './user';

export type FavoritoItem = {
  id: string;
  nombre: string;
  direccion: string;
  imagenUrl?: string;
};

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private storageKey = 'tripgo_favoritos';

  constructor(private userService: User) {}

  private getCurrentUserId(): string | null {
    const user = this.userService.getCurrentUser();
    if (!user) return null;

    return String(user.id);
  }

  private readStorage(): Record<string, FavoritoItem[]> {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return {};

    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  private saveStorage(data: Record<string, FavoritoItem[]>): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getFavoritos(): FavoritoItem[] {
    const userId = this.getCurrentUserId();
    if (!userId) return [];

    const allFavoritos = this.readStorage();
    return allFavoritos[userId] || [];
  }

  isFavorito(lugarId: string): boolean {
    return this.getFavoritos().some(fav => String(fav.id) === String(lugarId));
  }

  addFavorito(item: FavoritoItem): boolean {
    const userId = this.getCurrentUserId();
    if (!userId) return false;

    const allFavoritos = this.readStorage();
    const favoritosUsuario = allFavoritos[userId] || [];

    const yaExiste = favoritosUsuario.some(
      fav => String(fav.id) === String(item.id)
    );

    if (yaExiste) return false;

    allFavoritos[userId] = [...favoritosUsuario, item];
    this.saveStorage(allFavoritos);

    return true;
  }

  removeFavorito(lugarId: string): void {
    const userId = this.getCurrentUserId();
    if (!userId) return;

    const allFavoritos = this.readStorage();
    const favoritosUsuario = allFavoritos[userId] || [];

    allFavoritos[userId] = favoritosUsuario.filter(
      fav => String(fav.id) !== String(lugarId)
    );

    this.saveStorage(allFavoritos);
  }

  toggleFavorito(item: FavoritoItem): boolean {
    const existe = this.isFavorito(item.id);

    if (existe) {
      this.removeFavorito(item.id);
      return false;
    }

    this.addFavorito(item);
    return true;
  }

  clearFavoritos(): void {
    const userId = this.getCurrentUserId();
    if (!userId) return;

    const allFavoritos = this.readStorage();
    delete allFavoritos[userId];
    this.saveStorage(allFavoritos);
  }
}