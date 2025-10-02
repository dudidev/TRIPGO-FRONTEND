import { Component } from '@angular/core';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';

import { Router, RouterLink, } from '@angular/router';
import { User } from '../../service/user';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-register',
  imports: [Nav, Footer, FormsModule,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  name = '';
  email = '';
  password = '';

  constructor(private userService: User, private router: Router) { }

  onSubmit() {
    this.userService.register({ name: this.name, email: this.email, password: this.password });
    alert('Usuario registrado con éxito');
    this.router.navigate(['/login']);
  }
}
