import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';



@Component({
  selector: 'app-nocturna',
  imports: [CommonModule, RouterModule, Nav, Footer],
  templateUrl: './nocturna.component.html',
  styleUrl: './nocturna.component.css'
})
export class NocturnaComponent {

}
