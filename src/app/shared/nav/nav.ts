import { Component, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { User } from '../../service/user';
import { LanguageService } from '../../service/language.service';
import { ItinerarioService } from '../../service/itinerario.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';
import{ConfirmService} from '../../service/confirm.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, CommonModule, ConfirmDialogComponent],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements AfterViewInit {
  menuOpen = false;
  itinerarioOpen = false;
  enviandoEmail = false;

  @ViewChild('headerRef') headerRef!: ElementRef<HTMLElement>;

  constructor(
    private userService: User,
    private router: Router,
    private http: HttpClient,
    public lang: LanguageService,
    public itinerario: ItinerarioService,
    private confirmService: ConfirmService
  ) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => setTimeout(() => this.setNavOffset(), 0));
  }

  ngAfterViewInit() {
    this.setNavOffset();
    setTimeout(() => this.setNavOffset(), 0);
  }

  @HostListener('window:resize')
  onResize() {
    this.setNavOffset();
  }

  private setNavOffset() {
    if (!this.headerRef?.nativeElement) return;
    const h = this.headerRef.nativeElement.offsetHeight;
    document.documentElement.style.setProperty('--nav-offset', `${h}px`);
  }

  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  get isEmpresaPage(): boolean {
    return this.router.url.includes('/empresa');
  }

  toggleItinerario() {
    this.itinerarioOpen = !this.itinerarioOpen;
  }

  closeItinerario() {
    this.itinerarioOpen = false;
  }

  removeItItem(id: string) {
    this.itinerario.remove(id);
  }

  clearItinerario() {
    this.itinerario.clear();
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeItinerario();
  }

  /* ✅ NUEVO: cerrar itinerario al hacer click fuera */
  @HostListener('document:click')
  onDocClick() {
    // si el menú lateral está abierto, no hacemos nada (evita cierres raros)
    if (this.menuOpen) return;

    // si está abierto el itinerario y clickean fuera, se cierra.
    // (en el HTML debes tener stopPropagation en .itWrap/.itPopover)
    if (this.itinerarioOpen) this.closeItinerario();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    document.body.style.overflow = this.menuOpen ? 'hidden' : 'auto';
    setTimeout(() => this.setNavOffset(), 0);

    //  opcional: si abres menú, cierra carrito
    if (this.menuOpen) this.closeItinerario();
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.style.overflow = 'auto';
    setTimeout(() => this.setNavOffset(), 0);
  }

  confirmarItinerario() {
  if (this.itinerario.count === 0 || this.enviandoEmail) return;

  this.enviandoEmail = true;

  const usuario = this.userService.getCurrentUser();
  const token = localStorage.getItem('token'); // ← agregar esto

  this.http.post(
    `${environment.apiBaseUrl}/itinerario/enviar-email`,
    {
      email: usuario.correo_usuario,
      nombre: usuario.nombre_usuario,
      items: this.itinerario.items.map(i => ({
        nombre: i.nombre,
        direccion: i.direccion ?? '',
        imagenUrl: i.imagenUrl ?? null,
      }))
    },
    {
      headers: { Authorization: `Bearer ${token}` } // ← agregar esto
    }
  ).subscribe({
    next: () => {
      this.enviandoEmail = false;
      this.itinerario.clear();
      this.closeItinerario();
    },
    error: () => {
      this.enviandoEmail = false;
    }
  });
}

  logout(): void {
    this.userService.logout();
    this.closeMenu();
    this.closeItinerario();
    this.router.navigate(['/login']);
  }
  async confirmLogout() {
    console.log("CLICK SALIR");
  const ok = await this.confirmService.open({
    title: 'Cerrar sesión',
    message: '¿Seguro que deseas cerrar sesión?',
    confirmText: 'Sí, salir',
    cancelText: 'Cancelar',
    variant: 'warning'
  });

    console.log("RESPUESTA:", ok);
  if (ok) {
    this.logout();
  }
}
}
