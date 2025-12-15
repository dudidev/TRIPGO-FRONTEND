import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-editar-cuenta',
  imports: [Nav,CommonModule,Footer,ReactiveFormsModule],
  templateUrl: './editar-cuenta.html',
  styleUrl: './editar-cuenta.css'
})

export class EditarCuentaComponent implements OnInit {

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


  constructor(private fb: FormBuilder) {}
usuarioMock = {
  nombre_usuario: 'Karol Franco',
  correo_usuario: 'karol@gmail.com'
};
  ngOnInit(): void {
    this.form = this.fb.group({
      nombre_usuario: ['Karol franco', Validators.required],
      correo_usuario: ['karol@gmail.com', [Validators.required, Validators.email]]
    });

    // Datos simulados (luego vendrán del backend)
    this.form.patchValue({
      nombre_usuario: 'Usuario de prueba',
      correo_usuario: 'correo@prueba.com'
    });
  }

  guardar(): void {
    console.log('Datos listos para enviar al backend:', this.form.value);
  }
}
