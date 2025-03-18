import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router, private authService: AuthService) {}

  navegarMain(){
    this.router.navigate(['main'])
  }

  async loginWithGoogle() {
    await this.authService.loginWithGoogle();
  }

  async loginWithEmailAndPassword() {
    await this.authService.login('email@example.com', 'password');
  }
}
