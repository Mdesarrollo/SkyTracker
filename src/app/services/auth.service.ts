import { Injectable, inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword,UserCredential } from '@angular/fire/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { environment } from './../../environments/environment';
import { Router } from '@angular/router';

const firebaseApp = initializeApp(environment.firebaseConfig);
const db = getFirestore(firebaseApp);

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}
  
  // Iniciar sesión con Google
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      console.log('Usuario autenticado con Google:', result.user);
      this.router.navigate(['list']);

      // Guardar en Firestore
      setDoc(doc(db, 'users',user.uid), {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      }).then(() => console.log('Datos guardados en Firestore'));

      console.timeEnd('Tiempo de autenticación');
      this.router.navigate(['list']);
    }catch (error) {
      console.error('Error al autenticar con Google:', error);
    }
  }

  // Iniciar sesión con email y password
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Usuario autenticado:', userCredential.user);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Datos de acceso incorrectos');
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
      .then(userCredential => {
        console.log('Usuario registrado:', userCredential);
        this.router.navigate(['../main']); // Redirige a otra página después del registro (opcional)
        return userCredential;
      })
      .catch(error => {
        console.error('Error en el registro:', error);
        throw error;
      });
  }
}