import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
    FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  constructor(private router: Router, private authService: AuthService) {}

  navegarMain(){
    this.router.navigate(['main'])
  }

  navegarRegister(){
    this.router.navigate(['register'])
  }

  async loginWithGoogle() {
    await this.authService.loginWithGoogle();
  }

  onLogin() {
    this.authService.login(this.email, this.password)
      .then(userCredential => console.log('Usuario autenticado:', userCredential.user))
      .catch(error => console.error('Error al iniciar sesión:', error));
    }
}
