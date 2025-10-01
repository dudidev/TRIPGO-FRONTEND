import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';

import { User } from '../../service/user';



@Component({
  selector: 'app-principal',
  imports: [CommonModule, RouterModule, Nav, Footer],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  
   user: any;

  constructor(private userService: User, private router: Router) {
    this.user = this.userService.getCurrentUser();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
