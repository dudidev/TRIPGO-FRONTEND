import { Injectable } from '@angular/core';
import { ItemMenu } from '../data/menuPresupuesto.data';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  transformarMenu(raw: any, idTipo: number): ItemMenu[] {

    const backendProductos = raw?.servicios ?? [];

    if (Array.isArray(backendProductos) && backendProductos.length) {
      return backendProductos.map((p: any) => ({
        categoria: String(p.categoria ?? 'Servicios'),
        nombre   : String(p.nombre ?? 'Servicio'),
        precio   : Number(p.precio ?? 0),
        selected : false,
        cantidad : 0,
      }));
    }

  return [];
}

  // 🔹 Agrupa el menú por categorías (ESTE TE FALTABA)
  agruparMenu(items: ItemMenu[]): { cat: string; items: ItemMenu[] }[] {

    const grupos: { [key: string]: ItemMenu[] } = {};

    items.forEach(item => {
      if (!grupos[item.categoria]) {
        grupos[item.categoria] = [];
      }
      grupos[item.categoria].push(item);
    });

    return Object.keys(grupos).map(cat => ({
      cat,
      items: grupos[cat]
    }));
  }
}