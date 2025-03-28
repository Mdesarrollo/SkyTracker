🔥 Backend con Firebase para Autenticación

Este proyecto proporciona un backend basado en Firebase Authentication para gestionar el registro, inicio de sesión de usuarios en una aplicación web.

🚀 Tecnologías Utilizadas

Firebase Authentication - Manejo de autenticación con correo y contraseña.

Firebase Firestore (Opcional) - Almacenamiento de datos adicionales de usuarios.

Firebase Hosting (Opcional) - Despliegue del backend.

🛠️ Configuración e Instalación

1️⃣ Configurar Firebase

Ir a Firebase Console y crear un nuevo proyecto.

Activar Firebase Authentication y habilitar el método de inicio de sesión con correo y contraseña.

Obtener las credenciales del proyecto y agregarlas en src/environments/environment.ts:

```bash
export const environment = {
  production: false,
  firebaseConfig: {
   apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
  }
};

```

2️⃣ Instalar dependencias

```bash
npm install firebase @angular/fire
```

3️⃣ Importar Firebase en el módulo principal de Angular

En app.module.ts (para módulos) o en el componente 
```bash
    import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
    import { provideAuth, getAuth } from '@angular/fire/auth';

    @NgModule({
    providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth())
    ]
    })
    export class AppModule {}
```

principal si estás usando standalone components:

```bash
bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth())
  ]
});

```


