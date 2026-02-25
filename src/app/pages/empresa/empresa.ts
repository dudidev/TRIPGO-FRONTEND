import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Footer } from '../../shared/footer/footer';
import { Header } from '../../shared/header/header';
import { Nav } from '../../shared/nav/nav';
import { MapaComponent } from '../../shared/mapa/mapa';

type EmpresaDetalle = {
  nombre_establecimiento: string;
  ubicacion: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  correo?: string;
  horario_apertura?: string;
  horario_cierre?: string;

  promociones?: string;

  imagenes: string[];
  datosGenerales: string[];
  horarios: string[];

  lat?: number;
  lng?: number;
};

const EMPRESA_DEMO: EmpresaDetalle = {
  nombre_establecimiento: 'Café Montaña',
  ubicacion: 'Salento, Quindío',
  descripcion:
    'Un espacio acogedor con café de origen, postres artesanales y una vista espectacular al valle. Ideal para descansar, trabajar o compartir en familia.',
  direccion: 'Calle 5 # 3-21, Salento',
  telefono: '3001234567',
  correo: 'cafemontana@demo.com',
  horario_apertura: '8:00 AM',
  horario_cierre: '6:00 PM',
  promociones: '10% de descuento en bebidas calientes de lunes a miércoles.',
  imagenes: [
    'https://images.unsplash.com/photo-1442512595331-e89e73853f31',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814',
  ],
  datosGenerales: [
    'NIT: 900.000.000-1',
    'Métodos de pago: Efectivo / Tarjeta',
    'Ambiente: Familiar',
    'Pet friendly: Sí',
  ],
  horarios: [
    'Lunes a Viernes: 8:00 AM - 6:00 PM',
    'Sábados y Domingos: 8:00 AM - 7:00 PM',
  ],
  lat: 4.6367,
  lng: -75.5715,
};

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer, MapaComponent,Nav],
  templateUrl: './empresa.html',
  styleUrls: ['./empresa.css'],
})
export class EmpresaComponent implements OnInit {
  // 🔥 Solo visual (no backend)
  loading = false;
  errorMessage = '';

  establecimiento: EmpresaDetalle = structuredClone(EMPRESA_DEMO);
  establecimientoEdit: EmpresaDetalle = structuredClone(EMPRESA_DEMO);

  editMode = false;

  // inputs auxiliares para agregar items a listas
  nuevaImagen = '';
  nuevoDato = '';
  nuevoHorario = '';

  ngOnInit(): void {
    // ✅ No llamamos backend porque por ahora solo quieres ver lo visual
    this.loading = false;
    this.errorMessage = '';
  }

  editar() {
    this.establecimientoEdit = structuredClone(this.establecimiento);
    this.editMode = true;
    this.nuevaImagen = '';
    this.nuevoDato = '';
    this.nuevoHorario = '';
  }

  cancelar() {
    this.establecimientoEdit = structuredClone(this.establecimiento);
    this.editMode = false;
  }

  guardar() {
    this.establecimiento = structuredClone(this.establecimientoEdit);
    this.editMode = false;
    alert('Guardado solo visual (sin backend).');
  }

  addImagen() {
    const v = this.nuevaImagen.trim();
    if (!v) return;
    this.establecimientoEdit.imagenes = [...this.establecimientoEdit.imagenes, v];
    this.nuevaImagen = '';
  }

  removeImagen(i: number) {
    this.establecimientoEdit.imagenes = this.establecimientoEdit.imagenes.filter((_, idx) => idx !== i);
  }

  addDato() {
    const v = this.nuevoDato.trim();
    if (!v) return;
    this.establecimientoEdit.datosGenerales = [...this.establecimientoEdit.datosGenerales, v];
    this.nuevoDato = '';
  }

  removeDato(i: number) {
    this.establecimientoEdit.datosGenerales = this.establecimientoEdit.datosGenerales.filter((_, idx) => idx !== i);
  }

  addHorario() {
    const v = this.nuevoHorario.trim();
    if (!v) return;
    this.establecimientoEdit.horarios = [...this.establecimientoEdit.horarios, v];
    this.nuevoHorario = '';
  }

  removeHorario(i: number) {
    this.establecimientoEdit.horarios = this.establecimientoEdit.horarios.filter((_, idx) => idx !== i);
  }
}