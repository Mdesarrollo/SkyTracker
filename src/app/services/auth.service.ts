import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  Auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  UserCredential,
  FacebookAuthProvider,
  signOut,
  GithubAuthProvider,
  linkWithCredential,
  fetchSignInMethodsForEmail,
  linkWithPopup,
} from '@angular/fire/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { environment } from './../../environments/environment';
import { Router } from '@angular/router';

const firebaseApp = initializeApp(environment.firebaseConfig);
const db = getFirestore(firebaseApp);

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  //verficar si la cuanta de google ya esta registrada
  async vincularGitHubSiYaEstoyConGoogle() {
    const provider = new GithubAuthProvider();

    try {
      const result = await linkWithPopup(this.auth.currentUser!, provider);
      alert('GitHub vinculado exitosamente a tu cuenta de Google.');
    } catch (error: any) {
      if (error.code === 'auth/credential-already-in-use') {
        alert('Este GitHub ya está vinculado con otra cuenta.');
      } else {
        console.error('Error al vincular GitHub:', error);
      }
    }
  }

  // async vincularGoogleSiYaEstoyConGithub() {
  //   const provider = new GoogleAuthProvider();

  //   try {
  //     const result = await linkWithPopup(this.auth.currentUser!, provider);
  //     alert('Google vinculado exitosamente a tu cuenta de Github.');
  //   } catch (error: any) {
  //     if (error.code === 'auth/credential-already-in-use') {
  //       alert('Este Google ya está vinculado con otra cuenta.');
  //     } else {
  //       console.error('Error al vincular Google:', error);
  //     }
  //   }
  // }

  async vincularfacebookSiYaEstoyConGoogle() {
    const provider = new FacebookAuthProvider();

    try {
      const result = await linkWithPopup(this.auth.currentUser!, provider);
      alert('Google vinculado exitosamente a tu cuenta de Github.');
    } catch (error: any) {
      if (error.code === 'auth/credential-already-in-use') {
        alert('Este Google ya está vinculado con otra cuenta.');
      } else {
        console.error('Error al vincular Google:', error);
      }
    }
  }

  //google original
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      console.log('Usuario autenticado con Google:', result.user);
      this.router.navigate(['list']);

      //Guardar en Firestore
      setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      }).then(() => console.log('Datos guardados en Firestore'));

      console.timeEnd('Tiempo de autenticación');
      this.router.navigate(['list']);
    } catch (error: any) {
      console.error('Error al autenticar con Google:', error);

      if (error.code === 'auth/account-exists-with-different-credential') {
        const pendingCred = error.credential;
        const email = error.customData?.email;
        const methods = await fetchSignInMethodsForEmail(this.auth, email);

        if (methods.includes('github.com')) {
          alert(
            `Esta cuenta ya fue registrada con Google. Vamos a vincular GitHub a tu cuenta de Google.`
          );
          try {
            // Inicia sesión con Google
            const githubProvider = new GithubAuthProvider();
            const githubResult = await signInWithPopup(
              this.auth,
              githubProvider
            );

            // Vincula GitHub a la cuenta de Google
            await linkWithCredential(githubResult.user, pendingCred);
            console.log(githubResult.user+"hola comoe estas")
            alert(
              'Cuenta de Google vinculada exitosamente con tu cuenta de Github.'
            );
          } catch (linkError) {
            console.error('Error al vincular GitHub con Google:', linkError);
            alert('No se pudo vincular GitHub con la cuenta existente.');
          }
        } else {
          alert(
            `El correo ya está registrado con otro proveedor: ${methods.join(
              ', '
            )}`
          );
        }
      } else {
        console.error('Error en login con GitHub:', error);
      }
    }
  }

  //Iniciar sesión con Facebook
  // async loginWithFacebook() {
  //   const provider = new FacebookAuthProvider();
  //   const result = await signInWithPopup(this.auth, provider);
  //   const user = result.user;
  //   console.log('Usuario autenticado con Facebook:', result.user);
  //   this.router.navigate(['list']);

  //   // Guardar en Firestore
  //   setDoc(doc(db, 'users', user.uid), {
  //     email: user.email,
  //     name: user.displayName,
  //     photoURL: user.photoURL,
  //     uid: user.uid,
  //   }).then(() => console.log('Datos guardados en Firestore'));

  //   console.timeEnd('Tiempo de autenticación');
  //   this.router.navigate(['list']);
  // }

  async loginWithFacebook() {
    const facebookProvider = new FacebookAuthProvider();

    try {
      await signInWithPopup(this.auth, facebookProvider);
      console.log("estas en facebook del try")
      this.router.navigate(['/main']);
    } catch (error: any) {
      console.log("estas con facebook en el cath")
      if (error.code === 'auth/account-exists-with-different-credential') {
        const pendingCred = error.credential;
        const email = error.customData?.email;

        if (!email) {
          alert('No se pudo recuperar el correo del usuario.');
          return;
        }

        const methods = await fetchSignInMethodsForEmail(this.auth, email);

        if (methods.includes('google.com')) {
          alert(`Este correo ya está vinculado a Google. Se procederá a vincular tu cuenta de GitHub con la cuenta de Google.`);

          try {
            const googleProvider = new GoogleAuthProvider();
            const googleResult = await signInWithPopup(this.auth, googleProvider);
            const googleUser = googleResult.user;

            await linkWithCredential(googleUser, pendingCred);
            alert('Cuenta de GitHub vinculada exitosamente con tu cuenta de Google.');
            this.router.navigate(['/main']);
          } catch (linkError) {
            console.error('Error al vincular GitHub con Google:', linkError);
            alert('No se pudo vincular la cuenta de GitHub.');
          }
        } else {
          this.vincularfacebookSiYaEstoyConGoogle()
          alert(`El correo ya está registrado con otro proveedor: ${methods.join(', ')}`);
        }
      } else {
        console.error('Error al registrar con GitHub:', error);
        alert('Error al registrar con GitHub.');
      }
    }
  }

  // Cerrar sesión con Facebook
  async logoutF() {
    return signOut(this.auth);
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

      setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      }).then(() => console.log('Datos guardados en Firestore'));

      this.router.navigate(['list']);
      return userCredential;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Datos de acceso incorrectos');
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
      console.log('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  // creacion de registro
  signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        console.log('Usuario registrado:', userCredential);
        this.router.navigate(['../main']); // Redirige a otra página después del registro (opcional)
        return userCredential;
      })
      .catch((error) => {
        console.error('Error en el registro:', error);
        throw error;
      });
  }
  //cierre de sesion con github si tiene una cuenta vinculada con el navegador

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

  //Inicio de sesion con github
  async registerWithGitHub() {
    const githubProvider = new GithubAuthProvider();

    try {
      await signInWithPopup(this.auth, githubProvider);
      console.log("estas en github en el try")
      this.router.navigate(['/main']);
    } catch (error: any) {
      console.log("estas con github en el cath")
      if (error.code === 'auth/account-exists-with-different-credential') {
        const pendingCred = error.credential;
        const email = error.customData?.email;

        if (!email) {
          alert('No se pudo recuperar el correo del usuario.');
          return;
        }

        const methods = await fetchSignInMethodsForEmail(this.auth, email);

        if (methods.includes('google.com')) {
          alert(`Este correo ya está vinculado a Google. Se procederá a vincular tu cuenta de GitHub con la cuenta de Google.`);

          try {
            const googleProvider = new GoogleAuthProvider();
            const googleResult = await signInWithPopup(this.auth, googleProvider);
            const googleUser = googleResult.user;

            await linkWithCredential(googleUser, pendingCred);
            alert('Cuenta de GitHub vinculada exitosamente con tu cuenta de Google.');
            this.router.navigate(['/main']);
          } catch (linkError) {
            console.error('Error al vincular GitHub con Google:', linkError);
            alert('No se pudo vincular la cuenta de GitHub.');
          }
        } else {
          this.vincularGitHubSiYaEstoyConGoogle()
          alert(`El correo ya está registrado con otro proveedor: ${methods.join(', ')}`);
        }
      } else {
        console.error('Error al registrar con GitHub:', error);
        alert('Error al registrar con GitHub.');
      }
    }
  }

}
