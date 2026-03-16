import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EstablecimientoService } from '../../services/establecimiento.service';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { Api } from '../../api';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [Nav, Footer, CommonModule, FormsModule],
  templateUrl: './empresa.html',
  styleUrl:'./empresa.css'
})
export class EmpresaComponent implements OnInit {

  loading = false;
  saving = false;
  errorMessage = '';

  establecimientos: any[] = [];
  establecimientosFiltrados: any[] = [];
  searchTerm = '';

  selectedId: number | null = null;

  establecimientoOriginal: any = null;
  establecimientoEdit: any = null;

  editMode = false;

  modoLista = false;
  imagenesLugar: any[] = [];
  loadingImagenes = false;

  readonly diasSemana = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  constructor(
    private establecimientoService: EstablecimientoService,
    private api: Api
  ) {}

  ngOnInit(): void {
    this.obtenerMisEstablecimientos();
  }

  obtenerMisEstablecimientos(keepSelected = true) {
    this.loading = true;
    this.errorMessage = '';
    this.editMode = false;

    this.establecimientoService.getMios().subscribe({
      next: (resp: any) => {
        const raw = resp?.data ?? resp;

        const list = Array.isArray(raw) ? raw : (raw ? [raw] : []);
        this.establecimientos = list;
        this.establecimientosFiltrados = [...this.establecimientos];
        this.searchTerm = '';

        this.loading = false;

        if (this.establecimientos.length === 0) {
          this.establecimientoOriginal = null;
          this.establecimientoEdit = null;
          this.selectedId = null;
          this.modoLista = false;
          this.errorMessage = 'No tienes establecimientos asignados. Contacta soporte.';
          return;
        }

        if (this.establecimientos.length > 1) {
          this.modoLista = true;

          if (keepSelected && this.selectedId) {
            const found = this.establecimientos.find(e =>
              Number(e?.id_establecimiento ?? e?.id) === Number(this.selectedId)
            );
            if (found) {
              this.seleccionarEstablecimiento(found, false);
            }
          }
        } else {
          this.modoLista = false;
          this.seleccionarEstablecimiento(this.establecimientos[0]);
        }

        this.api.loadEstablecimientos();
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = 'Error al obtener los establecimientos. Revisa consola.';
        console.error('getMios error:', err);
      }
    });
  }

  filtrarEstablecimientos() {
    const termino = this.searchTerm.trim().toLowerCase();

    if (!termino) {
      this.establecimientosFiltrados = [...this.establecimientos];
      return;
    }

    this.establecimientosFiltrados = this.establecimientos.filter((est) => {
      const nombre = String(est?.nombre_establecimiento ?? '').toLowerCase();
      const ubicacion = String(est?.ubicacion ?? '').toLowerCase();
      const tipo = String(est?.tipo ?? '').toLowerCase();
      const direccion = String(est?.direccion ?? '').toLowerCase();
      const estado = String(est?.estado ?? '').toLowerCase();

      return (
        nombre.includes(termino) ||
        ubicacion.includes(termino) ||
        tipo.includes(termino) ||
        direccion.includes(termino) ||
        estado.includes(termino)
      );
    });
  }

  limpiarBusqueda() {
    this.searchTerm = '';
    this.establecimientosFiltrados = [...this.establecimientos];
  }
  seleccionarEstablecimiento(est: any, salirDeLista = true) {
    if (!est) return;

    const id = est.id_establecimiento ?? est.id ?? null;
    const parsedId = typeof id === 'number' ? id : Number(id);

    this.selectedId = parsedId;
    this.establecimientoOriginal = est;
    this.establecimientoEdit = structuredClone(est);
    this.editMode = false;

    this.obtenerImagenesLugar(parsedId);

    if (salirDeLista) this.modoLista = false;
  }
    obtenerImagenesLugar(id: number) {
    if (!id) {
      this.imagenesLugar = [];
      return;
    }

    this.loadingImagenes = true;

    this.establecimientoService.getImagenesLugar(id).subscribe({
      next: (resp: any) => {
        this.imagenesLugar = resp?.imagenes ?? [];
        this.loadingImagenes = false;
      },
      error: (err: any) => {
        console.error('getImagenesLugar error:', err);
        this.imagenesLugar = [];
        this.loadingImagenes = false;
      }
    });
  }

  volverALista() {
    if (this.establecimientos.length > 1) {
      this.modoLista = true;
      this.editMode = false;
      this.establecimientoOriginal = null;
      this.establecimientoEdit = null;
    }
  }

  editar() {
    if (!this.establecimientoOriginal) return;
    this.establecimientoEdit = structuredClone(this.establecimientoOriginal);
    this.editMode = true;
  }

  cancelar() {
    if (!this.establecimientoOriginal) return;
    this.establecimientoEdit = structuredClone(this.establecimientoOriginal);
    this.editMode = false;
  }

  guardarCambios() {
    if (!this.establecimientoOriginal || !this.establecimientoEdit) return;

    const id = this.establecimientoOriginal.id_establecimiento ?? this.selectedId;

    if (!id) {
      alert('No se encontró el id del establecimiento seleccionado.');
      return;
    }

    const payload = {
      nombre_establecimiento: this.establecimientoOriginal.nombre_establecimiento,
      ubicacion: this.establecimientoOriginal.ubicacion,
      direccion: this.establecimientoOriginal.direccion,
      tipo: this.establecimientoOriginal.tipo,
      descripcion: this.establecimientoEdit.descripcion,
      telefono: this.establecimientoEdit.telefono,
      correo: this.establecimientoEdit.correo,
      horario_apertura: this.establecimientoEdit.horario_apertura,
      horario_cierre: this.establecimientoEdit.horario_cierre,
      estado: this.establecimientoEdit.estado ?? 'activo'
    };

    this.saving = true;

    this.establecimientoService.updateMioById(Number(id), payload).subscribe({
      next: () => {
        this.saving = false;
        alert('Actualizado correctamente');
        this.obtenerMisEstablecimientos(true);
        this.api.loadEstablecimientos();
      },
      error: (err: any) => {
        this.saving = false;
        console.error('updateMioById error:', err);
        const msg = err?.error?.message || 'No se pudo actualizar. Revisa consola.';
        alert(msg);
      }
    });
  }
}