
# 🔐 Inicio de Sesión con Google (Google Login)

SkyTracker también ofrece la opción de autenticación mediante cuentas de Google, brindando a los usuarios una forma segura, rápida y familiar de acceder a la plataforma y personalizar su experiencia.

⚙️ Configuración de Facebook Developer

Debemos ir https://console.cloud.google.com.

Creamos un nuevo proyecto o se selecciona uno existente.

Habilita la API de "OAuth 2.0 Client IDs".

Configura la pantalla de consentimiento OAuth.

Crea un ID de cliente OAuth 2.0 de tipo "Aplicación web".

Añade el origen autorizado (ej. http://localhost:4200) en URIs de TypeScript.

Copia el Client ID para usarlo en tu app Angular.

Luego iremos a Firebase en el cual habilitaremos Google y usaremos la Api para relacionarlo y verificarlo con Google, luego usaremos una variable en la que traemos el provedor de Google y luego con un Popup hacemos una autenticacion de el proveedor y luego guardamos los datos en un arreglo y ademas los enviamos a Firestore y los guardamos en la base de datos.