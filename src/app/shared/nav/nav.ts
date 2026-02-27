import { Component, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { User } from '../../service/user';
import { LanguageService } from '../../service/language.service';
import { ItinerarioService } from '../../service/itinerario.service';

@Component({
  selector: 'app-nav',
  imports: [RouterModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  menuOpen = false;

  itinerarioOpen = false;

  constructor(
    private userService: User,
    private router: Router,
    public lang: LanguageService,
    private itinerario: ItinerarioService
  ) { }

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

  //  Cierra con ESC
  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeItinerario();
  }



  toggleMenu() {
    this.menuOpen = !this.menuOpen;

    if (this.menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.style.overflow = 'auto';
  }

  logout(): void {
    this.userService.logout();
    this.closeMenu();
    this.closeItinerario();
    this.router.navigate(['/login']);
  }
}