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

  navegarReset() {
    this.router.navigate(['forgot-password']);
  }
  //login con google
  async loginWithGoogle() {
    await this.authService.loginWithGoogle();
  }

  onLogin() {
    this.authService.login(this.email, this.password)
      .then(userCredential => console.log('Usuario autenticado:', userCredential.user))
      .catch(error => console.error('Error al iniciar sesión:', error));
  }

  //Login con Facebook
   async loginWithFacebook() {
    await this.authService.loginWithFacebook();
  }

  // configurar que se vea la contraseña
  showPassword = false; // Variable para controlar la visibilidad de la contraseña

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  //login con github

  async loginWithGithub(){
    await this.authService.registerWithGitHub();
  }
  
  
}
