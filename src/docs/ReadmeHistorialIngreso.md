# 📊 Proceso de Almacenamiento de Datos de Usuarios en Firestore (Colección `user_logins`)

Este documento describe el proceso paso a paso para configurar y utilizar la colección `user_logins` en Firebase Firestore, diseñada para registrar el historial de inicios de sesión de todos los usuarios en la aplicación SkyTracker.

## 🎯 Objetivo

El objetivo principal es capturar y almacenar de forma segura información detallada de cada evento de inicio de sesión de un usuario (ya sea por correo/contraseña, Google, Facebook o GitHub) en una colección dedicada de Firestore (`user_logins`), asegurando la integridad de los datos y la no sobrescritura de registros anteriores.

## 💾 Estructura de la Colección `user_logins`

Cada documento en la colección `user_logins` representa un evento de inicio de sesión individual. El ID del documento será generado automáticamente por Firebase (o una combinación de `uid` y un `timestamp` para mayor legibilidad y unicidad).

**Campos de un Documento de `user_logins`:**

| Campo       | Tipo                                                                                                         
| `uid`      `string`                                                                                                                                                         
| `email`   `string`                                                      
| `displayName``string`                                             
| `photoURL`  `string`                                                                                                      
| `authMethod` `string`                                                                                                                                                            
| `timestamp`  `Timestamp`                                

## 🛠️ Implementación en `auth.service.ts`

La lógica para guardar los registros de inicio de sesión se centraliza en el `AuthService`.

Esta función privada es la encargada de crear el documento en la colección `user_logins`.

```typescript
import { getFirestore, doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';

// Inicializar Firebase (asegúrate de que esto ya esté configurado)
const firebaseApp = initializeApp(environment.firebaseConfig);
const db = getFirestore(firebaseApp);

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  private async saveUserLoginData(user: any, authMethod: string): Promise<void> {
    try {
      // Genera un ID de documento único combinando UID y marca de tiempo actual para no sobrescribir.
      const docRef = doc(db, 'user_logins', `${user.uid}_${Date.now()}`);
      await setDoc(docRef, {
        uid: user.uid,
        email: user.email || null,       // Asegura 'null' si no hay email
        displayName: user.displayName || null, // Asegura 'null' si no hay displayName
        photoURL: user.photoURL || null,     // Asegura 'null' si no hay photoURL
        authMethod: authMethod,
        timestamp: serverTimestamp(),      // Marca de tiempo del servidor de Firestore
      });
      console.log(`Datos de inicio de sesión guardados en Firestore para el usuario: ${user.email} vía ${authMethod}`);
    } catch (error) {
      console.error('Error al guardar datos de inicio de sesión en Firestore:', error);
    }
  }
}


