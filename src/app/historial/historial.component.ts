import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent {
  constructor(private router: Router) { }
  
  navegarLogin(){
    this.router.navigate(['login'])
  }

  navegarMain(){
    this.router.navigate(['main'])
  }
}
