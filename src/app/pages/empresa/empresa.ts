import { Component, OnInit } from '@angular/core';
import { EstablecimientoService } from '../../services/establecimiento.service';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { Header } from '../../shared/header/header';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [Nav, Footer, CommonModule, Header],
  templateUrl: './empresa.html',
  styleUrls: ['./empresa.css']
})
export class EmpresaComponent implements OnInit {

  establecimiento: any = null;

  loading = false;
  errorMessage = '';

  constructor(private establecimientoService: EstablecimientoService) {}

  ngOnInit(): void {
    this.obtenerMiEstablecimiento();
  }

  obtenerMiEstablecimiento() {
    this.loading = true;
    this.errorMessage = '';

    this.establecimientoService.getMio().subscribe({
      next: (data) => {
        this.establecimiento = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;

        // ✅ si el backend responde: "No tienes establecimiento asociado"
        if (err?.status === 404) {
          this.establecimiento = null;
          this.errorMessage = err?.error?.message || 'No tienes establecimiento asociado';
          return;
        }

        this.errorMessage = 'Error al obtener el establecimiento. Revisa consola.';
        console.error('getMio error:', err);
      }
    });
  }

  actualizar() {
    if (!this.establecimiento) return;

    this.establecimientoService.updateMio(this.establecimiento).subscribe({
      next: () => {
        alert('Información actualizada correctamente');
      },
      error: (err) => {
        console.error('Error updateMio:', err);
        alert('No se pudo actualizar. Revisa consola.');
      }
    });
  }
}
