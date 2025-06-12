import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService  } from "../services/auth.service";


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  constructor(private router: Router, private authService: AuthService) { }

  navegarlogin(){
    this.router.navigate(['login'])
  }

  navegarHistorial(){
    this.router.navigate(['historial'])
  }

  navegarGithub(){
    this.router.navigate(['bgithub'])
  }

  mostrarperil(){
    this.authService.showProfile()
  }
  
  navegarUserHistory(){
    this.router.navigate(['user-history']);
  }

  
}
