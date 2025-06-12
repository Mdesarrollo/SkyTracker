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
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  collection,
} from 'firebase/firestore';
import { environment } from './../../environments/environment';
import { Router } from '@angular/router';

const firebaseApp = initializeApp(environment.firebaseConfig);
const db = getFirestore(firebaseApp);

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  // Función auxiliar para guardar los datos de inicio de sesión en Firestore
  private async saveUserLoginData(
    user: any,
    authMethod: string
  ): Promise<void> {
    try {
      // Firestore generará automáticamente un ID de documento para cada evento de inicio de sesión,
      const docRef = doc(db, 'user_logins', `${user.uid}_${Date.now()}`);
      await setDoc(docRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        authMethod: authMethod,
        timestamp: serverTimestamp(), // Usa la marca de tiempo del servidor de Firestore
      });
      console.log(
        `Datos de inicio de sesión guardados en Firestore para el usuario: ${user.email} vía ${authMethod}`
      );
    } catch (error) {
      console.error(
        'Error al guardar datos de inicio de sesión en Firestore:',
        error
      );
    }
  }

  private async saveUserProfileData(user: any): Promise<void> {
    try {
      // Guardar en Firestore en la colección 'users' con el UID como ID de documento
      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          email: user.email || null,
          displayName: user.displayName || null,
          photoURL: user.photoURL || null,
          createdAt: serverTimestamp(), // Asume que quieres registrar la fecha de creación del perfil
        },
        { merge: true }
      ); // Usar merge: true para no sobrescribir campos existentes si ya hay un perfil
      console.log(
        'Datos de perfil de usuario guardados/actualizados en Firestore (colección "users").'
      );
    } catch (error) {
      console.error('Error al guardar datos de perfil de usuario:', error);
    }
  }

  //login con google
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      console.log('Usuario autenticado con Google:', result.user);

      // Guardar datos de inicio de sesión en Firestore
      await this.saveUserLoginData(user, 'google.com');
      // this.router.navigate(['list']);

      await this.saveUserProfileData(user);

      localStorage.setItem(
        'user',
        JSON.stringify({
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        })
      );

      await Swal.fire({
        title: 'Inicio de Sesión con Google Exitoso',
        icon: 'success',
        draggable: true,
      });

      // // Guardar en Firestore
      // setDoc(doc(db, 'users', user.uid), {
      //   email: user.email,
      //   name: user.displayName,
      //   photoURL: user.photoURL,
      //   uid: user.uid,
      // }).then(() => console.log('Datos guardados en Firestore'));

      console.timeEnd('Tiempo de autenticación');
      this.router.navigate(['main']);
    } catch (error: any) {
      console.error('Error al autenticar con Google:', error);

      Swal.fire({
        title: 'Error al iniciar sesión con Google',
        text: error.message,
        icon: 'error',
        draggable: true,
      });
    }
  }

  // Inicio de sesion con facebook
  async loginWithFacebook() {
    const facebookProvider = new FacebookAuthProvider();

    try {
      const result = await signInWithPopup(this.auth, facebookProvider);
      const user = result.user;
      // await signInWithPopup(this.auth, facebookProvider);
      console.log('estas en facebook del try');

      // Guardar datos de inicio de sesión en Firestore
      await this.saveUserLoginData(user, 'facebook.com');

      await this.saveUserProfileData(user);
      localStorage.setItem(
        'user',
        JSON.stringify({
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        })
      );

      await Swal.fire({
        title: 'Inicio de Sesión con Facebook Exitoso',
        icon: 'success',
        draggable: true,
      });
      this.router.navigate(['main']);
    } catch (error: any) {
      console.log('Error de login con Facebook');

      Swal.fire({
        title: 'Error al iniciar sesión con Facebook',
        text: error.message,
        icon: 'error',
        draggable: true,
      });
    }
  }

  //cierre de sesion con github si tiene una cuenta vinculada con el navegador

  async logoutFromGitHub(): Promise<void> {
    const result = await Swal.fire({
      title: 'Quiere Cerrar Sesion de su Navegador antes de Iniciar',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    });

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
    await this.logoutFromGitHub();
    try {
      const provider = new GithubAuthProvider();
      provider.addScope('user:email'); // Solicita acceso a la dirección de correo electrónico del usuario
      provider.addScope('read:user'); // Solicita acceso a la información pública y no pública del perfil del usuario (incluye nombre)
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;

      console.log(
        'Usuario autenticado con GitHub (objeto user completo de Firebase):',
        user
      );
      console.log('Email de GitHub obtenido:', user.email);
      console.log('DisplayName de GitHub obtenido:', user.displayName);

      // Guardar datos de inicio de sesión en Firestore
      await this.saveUserLoginData(user, 'github.com');
      await this.saveUserProfileData(user);

      console.log('Usuario autenticado con Github:', result.user);

      localStorage.setItem(
        'user',
        JSON.stringify({
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        })
      );

      await Swal.fire({
        title: 'Inicio de Sesión con GitHub Exitoso',
        icon: 'success',
        draggable: true,
      });

      // // Guardar en Firestore
      // setDoc(doc(db, 'users', user.uid), {
      //   email: user.email,
      //   name: user.displayName,
      //   photoURL: user.photoURL,
      //   uid: user.uid,
      // }).then(() => console.log('Datos guardados en Firestore'));

      console.timeEnd('Tiempo de autenticación');
      this.router.navigate(['main']);
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage =
          'La ventana de inicio de sesión de GitHub fue cerrada por el usuario.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage =
          'La ventana emergente de GitHub fue bloqueada. Por favor, permítalas en su navegador.';
      }
      // Otros errores específicos de Firebase Auth con GitHub

      Swal.fire({
        title: 'Error al iniciar sesión con GitHub',
        text: errorMessage,
        icon: 'error',
        draggable: true,
      });
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
      // Guardar datos de inicio de sesión en Firestore
      await this.saveUserLoginData(user, 'password');
      await this.saveUserProfileData(user);

      await Swal.fire({
        title: 'Inicio de Sesion Exitoso',
        icon: 'success',
        draggable: true,
      });

      // setDoc(doc(db, 'users', user.uid), {
      //   email: user.email,
      //   name: user.displayName,
      //   photoURL: user.photoURL,
      //   uid: user.uid,
      // }).then(() => console.log('Datos guardados en Firestore'));

      this.router.navigate(['main']);
      return userCredential;
    } catch (error: any) {
      Swal.fire({
        title: 'Error al iniciar sesión',
        text: error.message,
        icon: 'error',
        draggable: true,
      });
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  // creacion de registro
  signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        // Opcional: guardar datos de registro en Firestore para un perfil de usuario estático
        // Si ya tienes una colección 'users' para perfiles de usuario, podrías guardarlo aquí.
        // Esto es diferente de la colección 'user_logins' que es para cada evento de inicio de sesión.
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName, // Probablemente será nulo para registro con email/contraseña inicialmente
          photoURL: user.photoURL, // Probablemente será nulo para registro con email/contraseña inicialmente
          createdAt: serverTimestamp(), // Marca de tiempo para la creación del usuario
        });
        console.log('Usuario registrado y perfil creado en Firestore:', user);

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

        let errorMessage =
          'Error en el registro. Por favor, verifica los campos.';
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'El correo electrónico ya está registrado.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
        }
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
