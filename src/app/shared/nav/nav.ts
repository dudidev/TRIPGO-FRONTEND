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
  constructor(private userService: User, private router: Router) {}

  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}