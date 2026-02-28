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
  selectedId: number | null = null;

  establecimientoOriginal: any = null;
  establecimientoEdit: any = null;

  editMode = false;

  // ✅ NUEVO: controla si mostramos lista aunque ya haya un seleccionado
  modoLista = false;

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

  // ✅ Trae todos
  obtenerMisEstablecimientos(keepSelected = true) {
    this.loading = true;
    this.errorMessage = '';
    this.editMode = false;

    this.establecimientoService.getMios().subscribe({
      next: (resp: any) => {
        const raw = resp?.data ?? resp;

        // ✅ Parse robusto: si viene array -> ok, si viene objeto -> lo convertimos
        const list = Array.isArray(raw) ? raw : (raw ? [raw] : []);
        this.establecimientos = list;

        this.loading = false;

        if (this.establecimientos.length === 0) {
          this.establecimientoOriginal = null;
          this.establecimientoEdit = null;
          this.selectedId = null;
          this.modoLista = false;
          this.errorMessage = 'No tienes establecimientos asignados. Contacta soporte.';
          return;
        }

        // ✅ Si hay varios, por defecto mostrar lista (cards)
        if (this.establecimientos.length > 1) {
          this.modoLista = true;

          // Si queremos mantener el seleccionado (por ejemplo al refrescar tras guardar)
          if (keepSelected && this.selectedId) {
            const found = this.establecimientos.find(e =>
              Number(e?.id_establecimiento ?? e?.id) === Number(this.selectedId)
            );
            if (found) {
              this.seleccionarEstablecimiento(found, /*salirDeLista*/ false);
            }
          }
        } else {
          // ✅ Si solo hay 1, lo abrimos directo
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

  // ✅ Selección desde card
  seleccionarEstablecimiento(est: any, salirDeLista = true) {
    if (!est) return;

    const id = est.id_establecimiento ?? est.id ?? null;
    const parsedId = typeof id === 'number' ? id : Number(id);

    this.selectedId = parsedId;
    this.establecimientoOriginal = est;
    this.establecimientoEdit = structuredClone(est);
    this.editMode = false;

    // si viene de cards, salimos de lista al editor
    if (salirDeLista) this.modoLista = false;
  }

  // ✅ Volver a cards
  volverALista() {
    if (this.establecimientos.length > 1) {
      this.modoLista = true;
      this.editMode = false;
      // no borramos selected para poder re-seleccionar rápido si quieres
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

    this.establecimientoService.updateMioById(Number(id), payload).subscribe({
      next: () => {
        this.saving = false;
        alert('Actualizado correctamente');

        // ✅ refrescamos pero mantenemos el seleccionado
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