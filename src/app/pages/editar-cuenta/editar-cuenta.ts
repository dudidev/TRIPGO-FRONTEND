import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { FavoritosService, FavoritoItem } from '../../service/favoritos.service';

@Component({
  selector: 'app-editar-cuenta',
  imports: [Nav, CommonModule, Footer, ReactiveFormsModule],
  templateUrl: './editar-cuenta.html',
  styleUrl: './editar-cuenta.css'
})
export class EditarCuentaComponent implements OnInit {

  idUsuario!: number;
  correoOriginal: string = '';

  mensaje: string = '';
  tipoMensaje: 'exito' | 'error' | 'cargando' | '' = '';

  form!: FormGroup;

  fotoSeleccionada: File | null = null;
  fotoPreview: string = '';
  fotoActual: string = '';

  // Modo edición
  editMode = false;
  saving = false;

  // Favoritos
  favoritos: FavoritoItem[] = [];
  loadingFavoritos = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private favoritosService: FavoritosService
  ) {}

  private cargarIdUsuarioLogueado(): number | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try { return Number(JSON.parse(raw).id) || null; } catch { return null; }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre_usuario       : ['', Validators.required],
      correo_usuario       : ['', [Validators.required, Validators.email]],
      password_actual      : [''],
      password_nueva       : [''],
      password_confirmacion: [''],
    });

    const id = this.cargarIdUsuarioLogueado();
    if (!id) {
      this.mensaje = '❌ No hay usuario logueado.';
      this.tipoMensaje = 'error';
      return;
    }

    this.idUsuario = id;

    this.usuarioService.obtenerUsuario(this.idUsuario).subscribe({
      next: (res) => {
        this.form.patchValue({
          nombre_usuario: res.data.nombre_usuario,
          correo_usuario: res.data.correo_usuario,
        });
        this.correoOriginal = res.data.correo_usuario || '';
        this.fotoActual     = res.data.foto_perfil || '';
        this.form.markAsPristine();
      },
      error: (err) => {
        this.mensaje = `❌ Error cargando usuario. Status: ${err.status}`;
        this.tipoMensaje = 'error';
      }
    });

    this.cargarFavoritos();
  }

  // ── Modo edición ──────────────────────────────────────────────

  activarEdicion(): void {
    this.editMode = true;
    this.mensaje  = '';
  }

  cancelarEdicion(): void {
    this.editMode = false;
    this.mensaje  = '';
    this.fotoPreview      = '';
    this.fotoSeleccionada = null;
    this.form.get('password_actual')?.reset();
    this.form.get('password_nueva')?.reset();
    this.form.get('password_confirmacion')?.reset();
  }

  // ── Favoritos ─────────────────────────────────────────────────

  cargarFavoritos(): void {
    this.loadingFavoritos = true;
    this.favoritosService.getFavoritosDesdeBackend().subscribe({
      next: (data) => { this.favoritos = data; this.loadingFavoritos = false; },
      error: ()     => { this.favoritos = []; this.loadingFavoritos = false; }
    });
  }

  eliminarFavorito(fav: FavoritoItem): void {
    this.favoritosService.removeFavorito(fav.id).subscribe(ok => {
      if (ok) this.favoritos = this.favoritos.filter(f => f.id !== fav.id);
    });
  }

  irADetalle(fav: FavoritoItem): void {
    this.router.navigate(['/detalles', fav.id]);
  }

  // ── Guardar ───────────────────────────────────────────────────

  guardar(): void {
    if (!this.idUsuario) {
      this.mensaje = '❌ No hay usuario logueado.';
      this.tipoMensaje = 'error'; return;
    }

    const password_actual       = (this.form.value.password_actual       || '').trim();
    const password_nueva        = (this.form.value.password_nueva        || '').trim();
    const password_confirmacion = (this.form.value.password_confirmacion || '').trim();
    const quiereCambiarPassword = !!password_nueva;

    if (quiereCambiarPassword) {
      if (!password_actual) {
        this.mensaje = '❌ Debes escribir tu contraseña actual.';
        this.tipoMensaje = 'error'; return;
      }
      if (password_nueva !== password_confirmacion) {
        this.mensaje = '❌ La nueva contraseña no coincide.';
        this.tipoMensaje = 'error'; return;
      }
    }

    if (this.form.invalid) {
      this.mensaje = 'Revisa los campos obligatorios.';
      this.tipoMensaje = 'error'; return;
    }

    const datosPerfil  = {
      nombre_usuario: this.form.value.nombre_usuario,
      correo_usuario: this.form.value.correo_usuario,
    };
    const correoNuevo  = (datosPerfil.correo_usuario || '').trim();
    const cambioCorreo = correoNuevo && correoNuevo !== this.correoOriginal;

    this.mensaje = 'Guardando cambios...';
    this.tipoMensaje = 'cargando';
    this.saving = true;

    this.usuarioService.actualizarUsuario(this.idUsuario, datosPerfil).subscribe({
      next: () => {
        this.subirFotoSiExiste(() => {
          this.cambiarPasswordSiAplica(password_actual, password_nueva, quiereCambiarPassword, () => {
            this.saving = false;
            const requiereReLogin = cambioCorreo || quiereCambiarPassword;

            this.form.get('password_actual')?.reset();
            this.form.get('password_nueva')?.reset();
            this.form.get('password_confirmacion')?.reset();
            this.form.markAsPristine();

            if (requiereReLogin) {
              this.mensaje = '✅ Cambios guardados. Inicia sesión nuevamente.';
              this.tipoMensaje = 'exito';
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setTimeout(() => this.router.navigate(['/login']), 800);
              return;
            }

            this.correoOriginal = correoNuevo;
            this.editMode = false;
            this.mensaje = '✅ Cambios guardados correctamente.';
            this.tipoMensaje = 'exito';
            setTimeout(() => { this.mensaje = ''; this.tipoMensaje = ''; }, 3000);
          });
        });
      },
      error: (err) => {
        this.saving = false;
        this.mensaje = `❌ No se pudo guardar el perfil. Status: ${err.status}`;
        this.tipoMensaje = 'error';
      }
    });
  }

  private subirFotoSiExiste(done: () => void) {
    if (!this.fotoSeleccionada) return done();
    const fd = new FormData();
    fd.append('foto', this.fotoSeleccionada);
    this.mensaje = 'Subiendo foto...';
    this.tipoMensaje = 'cargando';
    this.usuarioService.actualizarFotoPerfil(this.idUsuario, fd).subscribe({
      next: (res: any) => {
        this.fotoActual       = res.url;
        this.fotoPreview      = '';
        this.fotoSeleccionada = null;
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.foto_perfil = this.fotoActual;
        localStorage.setItem('user', JSON.stringify(user));
        done();
      },
      error: () => done()
    });
  }

  private cambiarPasswordSiAplica(
    password_actual: string,
    password_nueva: string,
    quiereCambiarPassword: boolean,
    done: () => void
  ) {
    if (!quiereCambiarPassword) return done();
    this.mensaje = 'Actualizando contraseña...';
    this.tipoMensaje = 'cargando';
    this.usuarioService.cambiarPassword(this.idUsuario, { password_actual, password_nueva }).subscribe({
      next : () => done(),
      error: (err) => {
        this.mensaje = err?.error?.message || '❌ No se pudo cambiar la contraseña.';
        this.tipoMensaje = 'error';
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    this.fotoSeleccionada = file;
    const reader = new FileReader();
    reader.onload = () => { this.fotoPreview = reader.result as string; };
    reader.readAsDataURL(file);
  }
}