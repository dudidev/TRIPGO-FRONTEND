import { Component, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { User } from '../../service/user';
import { LanguageService } from '../../service/language.service';

@Component({
  selector: 'app-nav',
  imports: [RouterModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements AfterViewInit {
  menuOpen = false;

  @ViewChild('headerRef') headerRef!: ElementRef<HTMLElement>;

  constructor(
    private userService: User,
    private router: Router,
    public lang: LanguageService
  ) {
    // Recalcular cuando cambias de ruta (por si aparece/desaparece nav-bar en /empresa)
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => setTimeout(() => this.setNavOffset(), 0));
  }

  ngAfterViewInit() {
    this.setNavOffset();
    // Recalcular una vez más por si hay fuentes/imagenes que cambian altura al cargar
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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;

    if (this.menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // si el menú afecta alto en móvil, recalcula
    setTimeout(() => this.setNavOffset(), 0);
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.style.overflow = 'auto';
    setTimeout(() => this.setNavOffset(), 0);
  }

  logout(): void {
    this.userService.logout();
    this.closeMenu();
    this.router.navigate(['/login']);
  }
}