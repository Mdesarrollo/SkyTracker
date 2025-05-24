
# 🔐 Inicio de sesión con GitHub en Angular + Firebase (StandAlone Components)

Esta guía te explica cómo **integrar inicio de sesión con GitHub** en un proyecto Angular que utiliza **componentes standalone**, sin `AppModule`.

---

## ✅ Requisitos previos

- Angular CLI (v15+ recomendado)
- Cuenta en Firebase
- Cuenta en GitHub

---

## 🧭 Pasos detallados

### 1. 🔧 Crear una aplicación OAuth en GitHub

1. Ve a: [https://github.com/settings/developers](https://github.com/settings/developers)
2. Crea una nueva aplicación OAuth:
   - **Application name:** Lo que quieras (por ejemplo: `MiAppAngular`)
   - **Homepage URL:** `http://localhost:4200/`
   - **Authorization callback URL:**  
     ```
     https://<TU_PROYECTO>.firebaseapp.com/__/auth/handler
     ```

3. Guarda los datos y copia:
   - `Client ID`
   - `Client Secret`

---

### 2. 🛠️ Configurar Firebase Authentication

1. Entra en [https://console.firebase.google.com](https://console.firebase.google.com)
2. Selecciona tu proyecto.
3. Ve a **Authentication > Método de inicio de sesión**.
4. Activa **GitHub** y pega los valores de:
   - `Client ID`
   - `Client Secret`

5. Finalmente se Integra el codigo en tu componenete para la creacion de el logueo con github

```bash
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
```
6. no olvies las importaciones

```bash
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
```












