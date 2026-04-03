import { Component, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { User } from '../../service/user';
import { LanguageService } from '../../service/language.service';
import { ItinerarioService, ItinerarioItem } from '../../service/itinerario.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';
import { ConfirmService } from '../../service/confirm.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { AuthService } from '../../services/auth.service';
import { DarkModeService } from '../dark-mode/dark-mode';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, CommonModule, ConfirmDialogComponent, TranslateModule, LanguageSwitcher],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements AfterViewInit {
  menuOpen       = false;
  itinerarioOpen = false;
  enviandoEmail  = false;
  emailEnviado  = false;
  isMobileOrTablet = window.innerWidth <= 1024;

  // Mapa de personas por item: { [itemId]: number }
  private personasMap: Record<string, number> = {};

  @ViewChild('headerRef') headerRef!: ElementRef<HTMLElement>;

  constructor(
    private userService   : User,
    private router        : Router,
    private http          : HttpClient,
    public  lang          : LanguageService,
    public  itinerario    : ItinerarioService,
    private confirmService: ConfirmService,
    public authService   : AuthService,
    public  darkMode      : DarkModeService
  ) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => setTimeout(() => this.setNavOffset(), 0));
  }

  ngAfterViewInit() {
    this.updateViewportState();
    this.setNavOffset();
    setTimeout(() => this.setNavOffset(), 0);
  }

  goToProtected(event: Event, route: string): void {
  if (this.authService.isLoggedIn()) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  this.router.navigate(['/login'], {
    queryParams: { returnUrl: route }
  });
}

  @HostListener('window:resize')
  onResize() { this.setNavOffset(); this.updateViewportState(); }

  private updateViewportState(): void {
  this.isMobileOrTablet = window.innerWidth <= 1024;
  }

  private setNavOffset() {
    if (!this.headerRef?.nativeElement) return;
    const h = this.headerRef.nativeElement.offsetHeight;
    document.documentElement.style.setProperty('--nav-offset', `${h}px`);
  }

get isLoggedIn(): boolean  { return this.authService.isLoggedIn(); }
get isEmpresaPage(): boolean { return this.router.url.includes('/empresa'); }

  // ── Itinerario popover ────────────────────────────────────────
toggleItinerario(event?: Event) {
  if (event) event.stopPropagation();

  // 🔐 Si no está logueado, redirige al login
  if (!this.authService.isLoggedIn()) {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: '/principal' }
    });
    return;
  }

  this.itinerarioOpen = !this.itinerarioOpen;
} closeItinerario()   { this.itinerarioOpen = false; }

  @HostListener('document:keydown.escape')
  onEsc() { this.closeItinerario(); }

  @HostListener('document:click')
  onDocClick() {
    if (this.menuOpen || this.enviandoEmail) return;
    if (this.itinerarioOpen) this.closeItinerario();
  }

  // ── Personas por lugar ────────────────────────────────────────
  getPersonas(id: string): number {
    return this.personasMap[id] ?? 1;
  }

  incrementPersonas(id: string): void {
    this.personasMap[id] = this.getPersonas(id) + 1;
  }

  decrementPersonas(id: string): void {
    const actual = this.getPersonas(id);
    if (actual > 1) this.personasMap[id] = actual - 1;
  }

  // ── Cálculos ──────────────────────────────────────────────────

  /** Subtotal de un item = suma productos × personas */
  getSubtotal(item: ItinerarioItem): number {
  if (!item.productos?.length) return 0;
  return item.productos.reduce((acc, p) => acc + (p.precio * (p.cantidad ?? 1)), 0);
}

  /** Total global = suma de todos los subtotales */
  getTotalGlobal(): number {
    return this.itinerario.items.reduce((acc, item) => acc + this.getSubtotal(item), 0);
  }

  /** Total de personas únicas (suma de todas las entradas de personasMap) */
  getTotalPersonas(): number {
    return this.itinerario.items.reduce((acc, item) => acc + this.getPersonas(item.id), 0);
  }

  // ── Quitar item con confirmación ──────────────────────────────
  async confirmarQuitarItem(id: string): Promise<void> {
    const item = this.itinerario.items.find(i => i.id === id);
    const ok = await this.confirmService.open({
      title      : 'Quitar lugar',
      message    : `¿Deseas quitar "${item?.nombre ?? 'este lugar'}" de tu itinerario?`,
      confirmText: 'Sí, quitar',
      cancelText : 'Cancelar',
      variant    : 'warning'
    });
    if (ok) {
      this.itinerario.remove(id);
      delete this.personasMap[id];
    }
  }

  // ── Limpiar con confirmación ──────────────────────────────────
  async confirmarLimpiar(): Promise<void> {
    if (this.itinerario.count === 0) return;
    const ok = await this.confirmService.open({
      title      : 'Limpiar itinerario',
      message    : '¿Seguro que deseas eliminar todos los lugares de tu itinerario?',
      confirmText: 'Sí, limpiar todo',
      cancelText : 'Cancelar',
      variant    : 'warning'
    });
    if (ok) {
      this.itinerario.clear();
      this.personasMap = {};
      this.closeItinerario();
    }
  }

  // ── Enviar itinerario ─────────────────────────────────────────
  private enviarItinerario(): void {
    if (this.itinerario.count === 0 || this.enviandoEmail) return;

    this.enviandoEmail = true;

    const usuario = this.userService.getCurrentUser();
    const token   = localStorage.getItem('token');

    this.http.post(
      `${environment.apiBaseUrl}/itinerario/enviar-email`,
      {
        email : usuario.correo_usuario,
        nombre: usuario.nombre_usuario,
        items : this.itinerario.items.map(i => ({
          nombre   : i.nombre,
          direccion: i.direccion ?? '',
          imagenUrl: i.imagenUrl ?? null,
          productos: i.productos ?? [],
          personas : this.getPersonas(i.id),
          subtotal : this.getSubtotal(i),
        }))
      },
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: () => {
        this.enviandoEmail = false;
        this.emailEnviado  = true; 
        this.itinerario.clear();
        this.personasMap = {};
        setTimeout(()=> {
        this.emailEnviado = false,
        this.closeItinerario();
      }, 2000)
        
      },
      error: () => { 
        this.enviandoEmail = false; }
    });
  }

  async confirmarItinerario(): Promise<void> {
    if (this.itinerario.count === 0 || this.enviandoEmail) return;

    const ok = await this.confirmService.open({
      title      : 'Confirmar itinerario',
      message    : `¿Deseas confirmar tu itinerario con ${this.itinerario.count} lugar${this.itinerario.count !== 1 ? 'es' : ''} y un total estimado de $${this.getTotalGlobal().toLocaleString('es-CO')} COP?`,
      confirmText: 'Sí, confirmar',
      cancelText : 'Cancelar',
      variant    : 'warning'
    });

    if (ok) this.enviarItinerario();
  }

  // ── Menú hamburguesa ──────────────────────────────────────────
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    document.body.style.overflow = this.menuOpen ? 'hidden' : 'auto';
    setTimeout(() => this.setNavOffset(), 0);
    if (this.menuOpen) this.closeItinerario();
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.style.overflow = 'auto';
    setTimeout(() => this.setNavOffset(), 0);
  }

  logout(): void {
    this.userService.logout();
    this.closeMenu();
    this.closeItinerario();
    this.router.navigate(['/login']);
  }

  async confirmLogout(): Promise<void> {
    const ok = await this.confirmService.open({
      title      : 'Cerrar sesión',
      message    : '¿Seguro que deseas cerrar sesión?',
      confirmText: 'Sí, salir',
      cancelText : 'Cancelar',
      variant    : 'warning'
    });
    if (ok) this.logout();
  }
}
