import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HapticService {

  // Toque suave — para favoritos, chips, navegación
  light() {
    if ('vibrate' in navigator) navigator.vibrate(10);
  }

  // Toque medio — para buscar, confirmar
  medium() {
    if ('vibrate' in navigator) navigator.vibrate(25);
  }

  // Toque fuerte — para acciones importantes
  heavy() {
    if ('vibrate' in navigator) navigator.vibrate([30, 10, 30]);
  }

  // Éxito — para guardar favorito, enviar formulario
  success() {
    if ('vibrate' in navigator) navigator.vibrate([15, 10, 15, 10, 40]);
  }

  // Error
  error() {
    if ('vibrate' in navigator) navigator.vibrate([50, 20, 50]);
  }
}