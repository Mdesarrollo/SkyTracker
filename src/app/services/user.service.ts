import { Injectable } from '@angular/core';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { environment } from './../../environments/environment';
import { initializeApp } from 'firebase/app';

// Inicializar Firebase
const firebaseApp = initializeApp(environment.firebaseConfig);
const db = getFirestore(firebaseApp);

@Injectable({
  providedIn: 'root'
})
export class UserService {
  async getUsers() {
    const usersCollection = collection(db, 'users');
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => doc.data());
  }
}