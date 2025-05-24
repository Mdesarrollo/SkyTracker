import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  Auth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  UserCredential,
  FacebookAuthProvider,
  signOut,
  GithubAuthProvider,
  deleteUser,
} from '@angular/fire/auth';
import Swal from 'sweetalert2';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { environment } from './../../environments/environment';
import { Router } from '@angular/router';

const firebaseApp = initializeApp(environment.firebaseConfig);
const db = getFirestore(firebaseApp);

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  //login con google
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      console.log('Usuario autenticado con Google:', result.user);
      this.router.navigate(['list']);

      localStorage.setItem(
        'user',
        JSON.stringify({
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        })
      );

      // Guardar en Firestore
      setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      }).then(() => console.log('Datos guardados en Firestore'));

      console.timeEnd('Tiempo de autenticación');
      this.router.navigate(['main']);
    } catch (error: any) {
      console.error('Error al autenticar con Google:', error);
    }
  }

  // Inicio de sesion con facebook
  async loginWithFacebook() {
    const facebookProvider = new FacebookAuthProvider();
    const result = await signInWithPopup(this.auth, facebookProvider);
    const user = result.user;

    try {
      await signInWithPopup(this.auth, facebookProvider);
      console.log('estas en facebook del try');
      this.router.navigate(['main']);

      localStorage.setItem(
        'user',
        JSON.stringify({
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        })
      );
    } catch (error: any) {
      console.log('Error de login con Facebook');
    }
  }

  //cierre de sesion con github si tiene una cuenta vinculada con el navegador

  async logoutFromGitHub(): Promise<void> {
    
    const result = await Swal.fire({
      title: "Quiere Cerrar Sesion de su Navegador antes de Iniciar",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`
    })
    
    if (result.isConfirmed) {
          return new Promise<void>((resolve) => {
          const logoutWindow = window.open('https://github.com/logout', '_blank');
          const checkClosed = setInterval(() => {
            if (logoutWindow?.closed) {
              clearInterval(checkClosed);
              resolve();
            }
          }, 500);
        });
      } 
    
  }

  async registerWithGitHub() {
    await this.logoutFromGitHub()
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      await Swal.fire({
        title: 'Inicio de sesion con GitHub Exitoso',
        icon: 'success',
        draggable: true,
      });
      console.log('Usuario autenticado con Google:', result.user);
      this.router.navigate(['/main']);
      localStorage.setItem(
        'user',
        JSON.stringify({
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        })
      );

      // Guardar en Firestore
      setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      }).then(() => console.log('Datos guardados en Firestore'));

      console.timeEnd('Tiempo de autenticación');
      this.router.navigate(['main']);
    } catch (error: any) {
      console.error('Error al autenticar con Google:', error);
    }
  }
  
  // Iniciar sesión con email y password
  async login(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log('Usuario autenticado:', user);
      await Swal.fire({
        title: 'Inicio de Sesion Exitoso',
        icon: 'success',
        draggable: true,
      });

      setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      }).then(() => console.log('Datos guardados en Firestore'));

      this.router.navigate(['main']);
      return userCredential;
    } catch (error) {
      Swal.fire({
        title: 'Ingreso de Datos Incorrectos',
        icon: 'success',
        draggable: true,
      })
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  // creacion de registro
  signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        Swal.fire({
          title: 'Registro Exitoso',
          icon: 'success',
          draggable: true,
        });
        this.router.navigate(['../main']); // Redirige a otra página después del registro (opcional)
        return userCredential;
      })
      .catch((error) => {
        console.error('Error en el registro:', error);
        Swal.fire({
          title: 'Error en el registro completa los campos correctamente',
          icon: 'error',
          draggable: true,
        });
        throw error;
      });
  }

  async enviarCorreoReset(email: string): Promise<void> {
    const actionCodeSettings = {
      url: 'https://skytracker-b6ff2.web.app/login',
      handleCodeInApp: false,
      
      
    };

    try {
      await sendPasswordResetEmail(this.auth, email, actionCodeSettings);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new Error('El correo no está registrado.');
      }
      throw error;
    }
  }

  //implemantacion de el cierre y eliminacion de cuenta con pop up
  async showProfile() {
    const user = this.auth.currentUser;
    let result: any;
    // si el proveddor solo da los datos de imagen del usuario
    if (user?.displayName == null && user?.email == null) {
      if (!user) return;
      console.log(this.auth.currentUser);
      result = await Swal.fire({
        title: user.displayName || 'Perfil de Usuario',
        html: `
          <img src="${
            user.photoURL || 'https://via.placeholder.com/100'
          }" width="100" style="border-radius: 50%; margin-top: 10px; margin:auto" />
        `,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Cerrar sesión',
        denyButtonText: 'Eliminar cuenta',
        cancelButtonText: 'Cerrar',
        reverseButtons: true,
      });
    } else if (user.displayName == null && user.photoURL == null) {
      // si el provedor solo da el correo como indormacion
      if (!user) return;
      console.log(this.auth.currentUser);
      result = await Swal.fire({
        title: user.displayName || 'Perfil de Usuario',
        html: `
          <p><strong>Correo:</strong> ${user.email} </p>
          <br>
          <img src=" ${
            user.photoURL ||
            'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
          }" width="100" style="border-radius: 50%; margin-top: 10px; margin:auto" />
        `,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Cerrar sesión',
        denyButtonText: 'Eliminar cuenta',
        cancelButtonText: 'Cerrar',
        reverseButtons: true,
      });
    } else {
      // si el provedor da solo la foto y el nombre
      if (!user) return;
      console.log(this.auth.currentUser);
      result = await Swal.fire({
        title: user.displayName || 'Perfil de Usuario',
        html: `
          <br>
          <img src=" ${
            user.photoURL ||
            'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
          }" width="200" style="border-radius: 50%; margin-top: 10px; margin:auto" />
        `,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Cerrar sesión',
        denyButtonText: 'Eliminar cuenta',
        cancelButtonText: 'Cerrar',
        reverseButtons: true,
      });
    }

    // Cerrar sesión
    if (result.isConfirmed) {
      await signOut(this.auth);
      Swal.fire('Sesión cerrada', 'Has salido correctamente.', 'success');
    }

    // Eliminar cuenta
    if (result.isDenied) {
      const confirmDelete = await Swal.fire({
        title: '¿Eliminar cuenta?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (confirmDelete.isConfirmed) {
        try {
          await deleteUser(user);
          Swal.fire(
            'Cuenta eliminada',
            'Tu cuenta ha sido eliminada de Firebase.',
            'success'
          );
        } catch (error: any) {
          if (error.code === 'auth/requires-recent-login') {
            Swal.fire(
              'Error',
              'Debes volver a iniciar sesión para eliminar tu cuenta.',
              'error'
            );
          } else {
            Swal.fire('Error', error.message, 'error');
          }
        }
      }
    }
  }
}
