import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EstablecimientoService } from '../../services/establecimiento.service';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { Api } from '../../api';
import { ConfirmService } from '../../service/confirm.service';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [Nav, Footer, CommonModule, FormsModule],
  templateUrl: './empresa.html',
  styleUrl: './empresa.css'
})
export class EmpresaComponent implements OnInit, OnDestroy {

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

  // 👇 Mapa id → primera imagen URL
  imagenesPreview: Map<number, string> = new Map();

  // Slider
  sliderIndex = 0;
  sliderProgress = 0;
  private sliderTimer: any;
  private readonly sliderInterval = 4000;

  // Imágenes
  uploadingImagen = false;

  // ── Servicios del establecimiento ─────────────────────────────
  loadingServicios = false;
  menuItems: any[] = [];
  menuAgrupado: { cat: string; items: any[] }[] = [];

  readonly diasSemana = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  constructor(
    private establecimientoService: EstablecimientoService,
    private api: Api,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.obtenerMisEstablecimientos();
  }

  ngOnDestroy(): void {
    clearInterval(this.sliderTimer);
  }

  // ── Establecimientos ──────────────────────────────────────────

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
          this.menuItems = [];
          this.menuAgrupado = [];
          this.errorMessage = 'No tienes establecimientos asignados. Contacta soporte.';
          return;
        }

        // 👇 Cargar preview de imágenes para todas las cards
        this.cargarImagenesPreviews();

        if (this.establecimientos.length > 1) {
          this.modoLista = true;
          if (keepSelected && this.selectedId) {
            const found = this.establecimientos.find(e =>
              Number(e?.id_establecimiento ?? e?.id) === Number(this.selectedId)
            );
            if (found) this.seleccionarEstablecimiento(found, false);
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

  // 👇 Llama al endpoint de imágenes por cada establecimiento y guarda la primera
  private cargarImagenesPreviews() {
    this.establecimientos.forEach(est => {
      const id = Number(est?.id_establecimiento ?? est?.id);
      if (!id || this.imagenesPreview.has(id)) return;

      this.establecimientoService.getImagenesLugar(id).subscribe({
        next: (resp: any) => {
          const imagenes = resp?.imagenes ?? [];
          if (imagenes.length > 0) {
            this.imagenesPreview.set(id, imagenes[0].url);
          }
        },
        error: () => {}
      });
    });
  }

  // 👇 Helper para usar en el HTML
  getPreviewImagen(est: any): string | null {
    const id = Number(est?.id_establecimiento ?? est?.id);
    return this.imagenesPreview.get(id) ?? null;
  }

  filtrarEstablecimientos() {
    const termino = this.searchTerm.trim().toLowerCase();
    if (!termino) {
      this.establecimientosFiltrados = [...this.establecimientos];
      return;
    }
    this.establecimientosFiltrados = this.establecimientos.filter((est) => {
      return (
        String(est?.nombre_establecimiento ?? '').toLowerCase().includes(termino) ||
        String(est?.ubicacion ?? '').toLowerCase().includes(termino) ||
        String(est?.tipo ?? '').toLowerCase().includes(termino) ||
        String(est?.direccion ?? '').toLowerCase().includes(termino) ||
        String(est?.estado ?? '').toLowerCase().includes(termino)
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
    this.cargarServicios(parsedId);

    if (salirDeLista) this.modoLista = false;
  }

  // ── Servicios ─────────────────────────────────────────────────

  cargarServicios(id: number) {
    if (!id) {
      this.menuItems = [];
      this.menuAgrupado = [];
      return;
    }

    this.loadingServicios = true;
    this.menuItems = [];
    this.menuAgrupado = [];

    this.establecimientoService.getServiciosByEstablecimiento(id).subscribe({
      next: (resp: any) => {
        const rawServicios = resp?.servicios ?? [];

        this.menuItems = Array.isArray(rawServicios)
          ? rawServicios.map((s: any) => ({
              categoria: String(s?.categoria ?? 'Servicios'),
              nombre: String(s?.nombre ?? 'Servicio'),
              precio: Number(s?.precio ?? 0)
            }))
          : [];

        this.agruparServicios();
        this.loadingServicios = false;
      },
      error: (err: any) => {
        console.error('getServiciosByEstablecimiento error:', err);
        this.menuItems = [];
        this.menuAgrupado = [];
        this.loadingServicios = false;
      }
    });
  }

  private agruparServicios() {
    const grupos: Record<string, any[]> = {};

    this.menuItems.forEach(item => {
      const categoria = item.categoria || 'Servicios';
      if (!grupos[categoria]) grupos[categoria] = [];
      grupos[categoria].push(item);
    });

    this.menuAgrupado = Object.keys(grupos).map(cat => ({
      cat,
      items: grupos[cat]
    }));
  }

  // ── Imágenes + Slider ─────────────────────────────────────────

  obtenerImagenesLugar(id: number) {
    if (!id) {
      this.imagenesLugar = [];
      return;
    }

    this.loadingImagenes = true;
    clearInterval(this.sliderTimer);

    this.establecimientoService.getImagenesLugar(id).subscribe({
      next: (resp: any) => {
        this.imagenesLugar = resp?.imagenes ?? [];
        this.loadingImagenes = false;
        if (this.imagenesLugar.length > 0) this.iniciarSlider();
      },
      error: (err: any) => {
        console.error('getImagenesLugar error:', err);
        this.imagenesLugar = [];
        this.loadingImagenes = false;
      }
    });
  }

  iniciarSlider() {
    this.sliderIndex = 0;
    this.resetSliderTimer();
  }

  sliderGoTo(index: number) {
    this.sliderIndex = (index + this.imagenesLugar.length) % this.imagenesLugar.length;
    this.resetSliderTimer();
  }

  sliderNext() { this.sliderGoTo(this.sliderIndex + 1); }
  sliderPrev() { this.sliderGoTo(this.sliderIndex - 1); }

  private resetSliderTimer() {
    clearInterval(this.sliderTimer);
    this.sliderProgress = 0;
    let elapsed = 0;
    const step = 50;

    this.sliderTimer = setInterval(() => {
      elapsed += step;
      this.sliderProgress = (elapsed / this.sliderInterval) * 100;
      if (elapsed >= this.sliderInterval) {
        elapsed = 0;
        this.sliderNext();
      }
    }, step);
  }

  // ── Subir imagen ──────────────────────────────────────────────

  onArchivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !this.selectedId) return;

    const archivo = input.files[0];
    input.value = '';
    this.uploadingImagen = true;

    this.establecimientoService.subirImagenLugar(this.selectedId, archivo).subscribe({
      next: () => {
        this.uploadingImagen = false;
        this.obtenerImagenesLugar(this.selectedId!);

        // Actualizar preview del mapa
        this.establecimientoService.getImagenesLugar(this.selectedId!).subscribe({
          next: (resp: any) => {
            const imgs = resp?.imagenes ?? [];
            if (imgs.length > 0) this.imagenesPreview.set(this.selectedId!, imgs[0].url);
          },
          error: () => {}
        });

        this.confirmService.open({
          title: '¡Imagen subida!',
          message: 'La imagen se agregó correctamente al establecimiento.',
          confirmText: 'Aceptar',
          cancelText: '',
          variant: 'info'
        });
      },
      error: (err: any) => {
        this.uploadingImagen = false;
        console.error('subirImagenLugar error:', err);
        this.confirmService.open({
          title: 'Error al subir',
          message: err?.error?.message || 'No se pudo subir la imagen. Intenta de nuevo.',
          confirmText: 'Entendido',
          cancelText: '',
          variant: 'danger'
        });
      }
    });
  }

  // ── Edición ───────────────────────────────────────────────────

  volverALista() {
    if (this.establecimientos.length > 1) {
      this.modoLista = true;
      this.editMode = false;
      this.establecimientoOriginal = null;
      this.establecimientoEdit = null;
      this.menuItems = [];
      this.menuAgrupado = [];
      clearInterval(this.sliderTimer);
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
      this.confirmService.open({
        title: 'Error',
        message: 'No se encontró el id del establecimiento seleccionado.',
        confirmText: 'Entendido',
        cancelText: '',
        variant: 'danger'
      });
      return;
    }

    const payload = {
      nombre_establecimiento : this.establecimientoOriginal.nombre_establecimiento,
      ubicacion              : this.establecimientoOriginal.ubicacion,
      direccion              : this.establecimientoOriginal.direccion,
      tipo                   : this.establecimientoOriginal.tipo,
      descripcion            : this.establecimientoEdit.descripcion,
      telefono               : this.establecimientoEdit.telefono,
      correo                 : this.establecimientoEdit.correo,
      horario_apertura       : this.establecimientoEdit.horario_apertura,
      horario_cierre         : this.establecimientoEdit.horario_cierre,
      estado                 : this.establecimientoEdit.estado ?? 'activo'
    };

    this.saving = true;

    this.establecimientoService.updateMioById(Number(id), payload).subscribe({
      next: () => {
        this.saving = false;
        this.confirmService.open({
          title: '¡Cambios guardados!',
          message: 'La información del establecimiento se actualizó correctamente.',
          confirmText: 'Aceptar',
          cancelText: '',
          variant: 'info'
        });
        this.obtenerMisEstablecimientos(true);
        this.api.loadEstablecimientos();
      },
      error: (err: any) => {
        this.saving = false;
        console.error('updateMioById error:', err);
        this.confirmService.open({
          title: 'Error al guardar',
          message: err?.error?.message || 'No se pudo actualizar. Revisa consola.',
          confirmText: 'Entendido',
          cancelText: '',
          variant: 'danger'
        });
      }
    });
  }
}