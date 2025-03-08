import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  constructor(private router: Router) { }

  navegarlogin(){
    this.router.navigate(['login'])
  }

  navegarHistorial(){
    this.router.navigate(['historial'])
  }
}
