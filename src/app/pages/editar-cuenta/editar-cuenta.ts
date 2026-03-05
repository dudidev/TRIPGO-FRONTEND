import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

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

  // Foto perfil
  fotoSeleccionada: File | null = null;
  fotoPreview: string = '';
  fotoActual: string = '';

  itinerarios = [
    { id: 1, nombre: 'Ruta del Café', descripcion: 'Recorrido por fincas cafeteras del Quindío' },
    { id: 2, nombre: 'Valle de Cocora', descripcion: 'Caminata ecológica y paisajes naturales' }
  ];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  private cargarIdUsuarioLogueado(): number | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;

    try {
      const user = JSON.parse(raw);
      return Number(user.id) || null;
    } catch {
      return null;
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre_usuario: ['', Validators.required],
      correo_usuario: ['', [Validators.required, Validators.email]],

      password_actual: [''],
      password_nueva: [''],
      password_confirmacion: [''],
    });

    const id = this.cargarIdUsuarioLogueado();
    if (!id) {
      this.mensaje = '❌ No hay usuario logueado (no encontré el id en localStorage).';
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
        this.fotoActual = res.data.foto_perfil || '';

        // para que no quede dirty por el patchValue
        this.form.markAsPristine();
      },
      error: (err) => {
        console.log('STATUS:', err.status);
        console.log('URL:', err.url);
        console.log('ERROR BODY:', err.error);
        this.mensaje = `❌ Error cargando usuario. Status: ${err.status}`;
        this.tipoMensaje = 'error';
      }
    });
  }

  guardar(): void {
    if (!this.idUsuario) {
      this.mensaje = '❌ No hay usuario logueado.';
      this.tipoMensaje = 'error';
      return;
    }

    // Validación passwords
    const password_actual = (this.form.value.password_actual || '').trim();
    const password_nueva = (this.form.value.password_nueva || '').trim();
    const password_confirmacion = (this.form.value.password_confirmacion || '').trim();

    const quiereCambiarPassword = !!password_nueva;

    if (quiereCambiarPassword) {
      if (!password_actual) {
        this.mensaje = '❌ Debes escribir tu contraseña actual.';
        this.tipoMensaje = 'error';
        return;
      }
      if (password_nueva !== password_confirmacion) {
        this.mensaje = '❌ La nueva contraseña no coincide con la confirmación.';
        this.tipoMensaje = 'error';
        return;
      }
    }

    if (this.form.invalid) {
      this.mensaje = 'Revisa los campos obligatorios.';
      this.tipoMensaje = 'error';
      return;
    }

    const datosPerfil = {
      nombre_usuario: this.form.value.nombre_usuario,
      correo_usuario: this.form.value.correo_usuario,
    };

    const correoNuevo = (datosPerfil.correo_usuario || '').trim();
    const cambioCorreo = correoNuevo && correoNuevo !== this.correoOriginal;

    this.mensaje = 'Guardando cambios...';
    this.tipoMensaje = 'cargando';

    // 1) Guardar perfil (nombre/correo)
    this.usuarioService.actualizarUsuario(this.idUsuario, datosPerfil).subscribe({
      next: () => {
        // 2) Subir foto si existe, luego 3) cambiar password si aplica, luego finalizar
        this.subirFotoSiExiste(() => {
          this.cambiarPasswordSiAplica(password_actual, password_nueva, quiereCambiarPassword, () => {
            const requiereReLogin = cambioCorreo || quiereCambiarPassword;

            // limpiar inputs de password
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

            // actualizar correo original si no hubo relogin (para no detectar cambio falso)
            this.correoOriginal = correoNuevo;

            this.mensaje = '✅ Cambios guardados correctamente.';
            this.tipoMensaje = 'exito';

            setTimeout(() => {
              this.mensaje = '';
              this.tipoMensaje = '';
            }, 3000);
          });
        });
      },
      error: (err) => {
        console.log('STATUS:', err.status);
        console.log('URL:', err.url);
        console.log('ERROR BODY:', err.error);
        this.mensaje = `❌ No se pudo guardar el perfil. Status: ${err.status}`;
        this.tipoMensaje = 'error';
      }
    });
  }

  private subirFotoSiExiste(done: () => void) {
    if (!this.fotoSeleccionada) return done();

    const fd = new FormData();
    fd.append('imagen', this.fotoSeleccionada);

    this.mensaje = 'Subiendo foto...';
    this.tipoMensaje = 'cargando';

    this.usuarioService.actualizarFotoPerfil(this.idUsuario, fd).subscribe({
      next: (res: any) => {
        this.fotoActual = res.url;
        this.fotoPreview = '';
        this.fotoSeleccionada = null;

        // mantener localStorage consistente
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.foto_perfil = this.fotoActual;
        localStorage.setItem('user', JSON.stringify(user));

        done();
      },
      error: (err) => {
        console.log('STATUS:', err.status);
        console.log('URL:', err.url);
        console.log('ERROR BODY:', err.error);
        this.mensaje = `✅ Perfil guardado, pero ❌ falló la foto. Status: ${err.status}`;
        this.tipoMensaje = 'error';
      }
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

    this.usuarioService.cambiarPassword(this.idUsuario, {
      password_actual,
      password_nueva
    }).subscribe({
      next: () => done(),
      error: (err) => {
        console.log('STATUS:', err.status);
        console.log('URL:', err.url);
        console.log('ERROR BODY:', err.error);
        this.mensaje = err?.error?.message || `❌ No se pudo cambiar la contraseña. Status: ${err.status}`;
        this.tipoMensaje = 'error';
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    this.fotoSeleccionada = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.fotoPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}