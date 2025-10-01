import { Component } from '@angular/core';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';

import { Router } from '@angular/router';
import { User } from '../../service/user';



@Component({
  selector: 'app-register',
  imports: [Nav,Footer],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  constructor(private userService: User, private router: Router) {}

  onRegister(form: any) {
    const success = this.userService.register({
      name: form.first,
      email: form.email,
      password: form.password
    });

    if (success) {
      alert('Usuario registrado con éxito');
      this.router.navigate(['/login']);
    } else {
      alert('El correo ya está registrado');
    }
  }
 
}
