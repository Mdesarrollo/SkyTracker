import { Injectable } from '@angular/core';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
  onSnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { environment } from './../../environments/environment';
import { initializeApp } from 'firebase/app';
import { Observable } from 'rxjs'; // Importar Observable de RxJS
// Definición de la interfaz para el registro de inicio de sesión de usuario
export interface UserLoginRecord {
  id?: string; // Opcional, ya que lo añadimos nosotros después de obtenerlo de Firestore
  uid: string;
  email?: string; // El email puede ser opcional para algunos proveedores o si el usuario no lo tiene
  displayName?: string; // El nombre de visualización puede ser opcional
  photoURL?: string; // La URL de la foto puede ser opcional
  authMethod: string;
  timestamp: Timestamp; // Usamos el tipo Timestamp de Firebase Firestore
}

// Inicializar Firebase
const firebaseApp = initializeApp(environment.firebaseConfig);
const db = getFirestore(firebaseApp);

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  // NUEVO: Método para obtener todos los usuarios con actualizaciones en tiempo real
  getAllUsersRealtime(
    sortBy: string = 'timestamp',
    sortDirection: 'desc' | 'asc' = 'desc'
  ): Observable<UserLoginRecord[]> {
    const usersCollectionRef = collection(db, 'user_logins');
    let orderField: string;

    switch (sortBy) {
      case 'date':
        orderField = 'timestamp';
        break;
      case 'name':
        orderField = 'displayName';
        break;
      case 'email':
        orderField = 'email';
        break;
      default:
        orderField = 'timestamp';
    }

    const q = query(usersCollectionRef, orderBy(orderField, sortDirection));

    return new Observable((subscriber) => {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const records: UserLoginRecord[] = [];
          snapshot.forEach((doc) => {
            records.push({ id: doc.id, ...doc.data() } as UserLoginRecord);
          });
          subscriber.next(records); // Emitir los datos actualizados
        },
        (error) => {
          subscriber.error(error); // Manejar errores
        }
      );

      // Cuando el Observable se desuscribe, también desuscribirse de Firestore
      return () => unsubscribe();
    });
  }
}
