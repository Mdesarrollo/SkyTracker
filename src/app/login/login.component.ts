import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth, GithubAuthProvider, signInWithPopup } from '@angular/fire/auth';

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
  
  constructor(private router: Router, private authService: AuthService, private auth: Auth) {}

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

  //Login con Facebook
   async loginWithFacebook() {
    await this.authService.loginWithFacebook();
  }

  // configurar que se vea la contraseña
  showPassword = false; // Variable para controlar la visibilidad de la contraseña

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
    logoutFromGitHub(): Promise<void> {
      return new Promise((resolve) => {
        const logoutWindow = window.open('https://github.com/logout', '_blank');
        const checkClosed = setInterval(() => {
          if (logoutWindow?.closed) {
            clearInterval(checkClosed);
            resolve();
          }
        }, 500);
      });
    }
    
    async registerWithGitHub() {
      const confirmLogout = confirm('¿Quieres cerrar sesión en el Github registrado en tu nevgador para usar otra cuenta ?');
      
      if (confirmLogout) {
        await this.logoutFromGitHub();
      }
    
      const provider = new GithubAuthProvider();
      // signInWithPopup(this.auth, provider)
        try {
          const result: any = await signInWithPopup(this.auth, provider);
          const user = result.user;
          const isNewUser = result._tokenResponse?.isNewUser;
  
          if (isNewUser) {
            alert('Nuevo usuario registrado con GitHub:');
          } else {
  
            alert('Esta cuenta ya esta resgistrada, ¿Quieres Iniciar Sesion?')
  
            // if () {
            //   alert('Iniciaste sesion correctamente')
            // }else{
            //   this.router.navigate(['/main'])
            // }
            
          }
        }catch(error) {
          console.error('Error en login:', error);
        };
        
    }
}
