import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';  
@Component({
  selector: 'app-about',
  imports: [CommonModule, Nav, Footer],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {

}
