import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-editar-cuenta',
  imports: [Nav,CommonModule,Footer,ReactiveFormsModule],
  templateUrl: './editar-cuenta.html',
  styleUrl: './editar-cuenta.css'
})

export class EditarCuentaComponent implements OnInit {

  idUsuario!: number;
  correoOriginal: string = '';
  mensaje: string = '';
  tipoMensaje: 'exito' | 'error' | 'cargando' | '' = '';
  fotoSeleccionada: File | null = null;
  fotoPreview: string = '';
  fotoActual: string = '';

  form!: FormGroup;

  itinerarios = [
  {
    id: 1,
    nombre: 'Ruta del Café',
    descripcion: 'Recorrido por fincas cafeteras del Quindío'
  },
  {
    id: 2,
    nombre: 'Valle de Cocora',
    descripcion: 'Caminata ecológica y paisajes naturales'
  }
];


  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router ) {}
  usuarioMock = {
  nombre_usuario: '',
  correo_usuario: ''
};

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
    password_u: [''],
  });

  const id = this.cargarIdUsuarioLogueado();
  if (!id) {
    this.mensaje = '❌ No hay usuario logueado (no encontré el id en localStorage).';
    this.tipoMensaje = 'error';
    return;
  }

  this.idUsuario = id;

  this.usuarioService.obtenerUsuario(this.idUsuario).subscribe(res => {
    this.form.patchValue(res.data);

    this.correoOriginal = res.data.correo_usuario; //  guardar correo actual
    this.form.markAsPristine();

    this.fotoActual = res.data.foto_perfil || '';

    // MUY IMPORTANTE: para que el "dirty" no se dispare solo por patchValue
    this.form.markAsPristine();
  });
}

guardar(): void {
  if (!this.idUsuario) {
    this.mensaje = '❌ No hay usuario logueado.';
    this.tipoMensaje = 'error';
    return;
  }

  if (!this.form.dirty) {
    this.mensaje = 'No hay cambios para guardar.';
    this.tipoMensaje = 'error';
    return;
  }

  if (this.form.invalid) {
    this.mensaje = 'Revisa los campos obligatorios.';
    this.tipoMensaje = 'error';
    return;
  }

  const datos: any = { ...this.form.value };

  const correoNuevo = (datos.correo_usuario || '').trim();
  const cambioCorreo = correoNuevo && correoNuevo !== this.correoOriginal;

  const cambioPassword = !!(datos.password_u && datos.password_u.trim().length > 0);

  // si no escribió contraseña, no la mandamos
  if (!cambioPassword) delete datos.password_u;

  const requiereReLogin = cambioCorreo || cambioPassword;

  this.mensaje = 'Guardando cambios...';
  this.tipoMensaje = 'cargando';

  this.usuarioService.actualizarUsuario(this.idUsuario, datos).subscribe({
    next: () => {
      this.form.get('password_u')?.reset();
      this.form.markAsPristine();

      if (requiereReLogin) {
        this.mensaje = cambioCorreo && cambioPassword
          ? 'Correo y contraseña actualizados. Inicia sesión nuevamente.'
          : cambioCorreo
            ? 'Correo actualizado. Inicia sesión nuevamente.'
            : 'Contraseña actualizada. Inicia sesión nuevamente.';
        this.tipoMensaje = 'exito';

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setTimeout(() => this.router.navigate(['/login']), 800);
        return;
      }

      this.mensaje = '✅ Cambios guardados correctamente.';
      this.tipoMensaje = 'exito';

      setTimeout(() => {
        this.mensaje = '';
        this.tipoMensaje = '';
      }, 3000);
    },
    error: (err) => {
      console.log('STATUS:', err.status);
      console.log('URL:', err.url);
      console.log('ERROR BODY:', err.error);
      this.mensaje = `❌ No se pudo guardar. Status: ${err.status}`;
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

  subirFotoPerfil() {

    if (!this.idUsuario) {
      this.mensaje = '❌ No hay usuario logueado.';
      this.tipoMensaje = 'error';
      return;
    }

    if (!this.fotoSeleccionada) {
      this.mensaje = 'Selecciona una imagen primero.';
      this.tipoMensaje = 'error';
      return;
    }

    const fd = new FormData();
    fd.append('imagen', this.fotoSeleccionada);

    this.mensaje = 'Subiendo foto...';
    this.tipoMensaje = 'cargando';

    this.usuarioService.actualizarFotoPerfil(this.idUsuario, fd)
    .subscribe({
      next: (res: any) => {

        this.fotoActual = res.url;
        this.fotoPreview = '';
        this.fotoSeleccionada = null;

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.foto_perfil = this.fotoActual;
        localStorage.setItem('user', JSON.stringify(user));

        this.mensaje = ' Foto actualizada correctamente.';
        this.tipoMensaje = 'exito';
      },

      error: (err) => {
  console.log('STATUS:', err.status);
  console.log('URL:', err.url);
  console.log('ERROR BODY:', err.error);
  console.log('FULL:', err);
  this.mensaje = `❌ Error al subir foto. Status: ${err.status}`;
  this.tipoMensaje = 'error';
}
    });

  }

}
