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

  // Llegada del back
  establecimientoOriginal: any = null;

  // Copia editable
  establecimientoEdit: any = null;

  editMode = false;

  // días fijos (solo UI)
  readonly diasSemana = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  constructor(
    private establecimientoService: EstablecimientoService,
    private api: Api
  ) {}

  ngOnInit(): void {
    this.obtenerMiEstablecimiento();
  }

  obtenerMiEstablecimiento() {
    this.loading = true;
    this.errorMessage = '';
    this.editMode = false;

    this.establecimientoService.getMio().subscribe({
      next: (data) => {
        // si tu back devuelve {ok,data} cambia esto a data.data
        const est = data?.data ?? data;

        this.establecimientoOriginal = est;
        this.establecimientoEdit = structuredClone(est);
        this.loading = false;

        this.api.loadEstablecimientos();
      },
      error: (err) => {
        this.loading = false;

        if (err?.status === 404) {
          this.establecimientoOriginal = null;
          this.establecimientoEdit = null;
          this.errorMessage = 'No tienes establecimiento asignado. Contacta soporte.';
          return;
        }

        this.errorMessage = 'Error al obtener el establecimiento. Revisa consola.';
        console.error('getMio error:', err);
      }
    });
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

    // payload seguro: bloqueados desde original, editables desde edit
    const payload = {
      // BLOQUEADOS
      nombre_establecimiento: this.establecimientoOriginal.nombre_establecimiento,
      ubicacion: this.establecimientoOriginal.ubicacion,
      direccion: this.establecimientoOriginal.direccion,
      tipo: this.establecimientoOriginal.tipo,

      // EDITABLES
      descripcion: this.establecimientoEdit.descripcion,
      telefono: this.establecimientoEdit.telefono,
      correo: this.establecimientoEdit.correo,
      horario_apertura: this.establecimientoEdit.horario_apertura,
      horario_cierre: this.establecimientoEdit.horario_cierre,
      estado: this.establecimientoEdit.estado ?? 'activo'
    };

    this.saving = true;

    this.establecimientoService.updateMio(payload).subscribe({
      next: () => {
        this.saving = false;
        alert('Actualizado correctamente');
        this.api.loadEstablecimientos();
        this.obtenerMiEstablecimiento();
      },
      error: (err) => {
        this.saving = false;
        console.error('updateMio error:', err);
        alert('No se pudo actualizar. Revisa consola.');
      }
    });
  }
}