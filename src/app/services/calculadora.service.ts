import { Injectable } from '@angular/core';
import { ItemMenu } from '../data/menuPresupuesto.data';

@Injectable({
  providedIn: 'root'
})
export class CalculadoraService {

  calcularTotal(items: ItemMenu[]): number {
    return items.reduce((acc, i) => acc + i.precio * (i.cantidad ?? 0), 0);
  }

  incrementar(item: ItemMenu): ItemMenu {
    return {
      ...item,
      cantidad: (item.cantidad ?? 0) + 1
    };
  }

  decrementar(item: ItemMenu): ItemMenu {
    if (!item.cantidad || item.cantidad <= 0) return item;

    return {
      ...item,
      cantidad: item.cantidad - 1
    };
  }

    toggle(items: ItemMenu[], item: ItemMenu): ItemMenu[] {
    return items.map(i => {
        if (i.nombre === item.nombre) {
        const selected = !i.selected;

        return {
            ...i,
            selected,
            cantidad: selected ? (i.cantidad || 1) : 0
        };
        }
        return i;
    });
    }
}