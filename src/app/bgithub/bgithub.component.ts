import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, GithubAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-bgithub',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './bgithub.component.html',
  styleUrl: './bgithub.component.css'
})

export class BgithubComponent {

  constructor(private auth: Auth, private router: Router ) {}

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

  main(){
    this.router.navigate(['main'])
  }
  // loginWithGitHub() {
  //   const provider = new GithubAuthProvider();
  //   signInWithPopup(this.auth, provider)
  //     .then((result: any)=> {
  //       const user = result.user;
  //       const isNewUser = result._tokenResponse?.isNewUser;
  //       // console.log('Usuario autenticado con GitHub:', user);
  //       if (isNewUser) {
  //         console.log('Nuevo usuario registrado con GitHub:', user);
  //       } else {

  //         const confirmLogout = confirm(
  //           'Ya estás registrado con esta cuenta de GitHub.\n¿Quieres cerrar sesión de GitHub para usar otra cuenta?'
  //         );
          
  //         if (confirmLogout) {
  //           this.logoutFromGitHub();
  //         } else {
  //           console.log('El usuario decidió quedarse en la página.');
  //         }
          
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error al iniciar sesión con GitHub:', error);
  //     });
  // }

  // logoutFromGitHub() {
  //   window.open('https://github.com/logout', '_blank');
  // }

}
