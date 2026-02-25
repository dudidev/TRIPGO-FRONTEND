import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { User } from '../../service/user';

@Component({
  selector: 'app-nav',
  imports: [RouterModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  menuOpen = false;

  constructor(private userService: User, private router: Router) { }

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
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.style.overflow = 'auto';
  }


  logout(): void {
    this.userService.logout();
    this.closeMenu();
    this.router.navigate(['/login']);
  }
}