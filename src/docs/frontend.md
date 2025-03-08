
# SkyTracker-Frontend

El proyecto se trata de la creacion de una pagina web
que permita visualizar diversos datos del clima, con pequeños datos estadsticos por medio de graficos, componentes de datos y demas formas para un entorno amigable donde el usuario puede interactuar con la web de manera intuitiva.

## Deployment

Para la ejececucion de este proyecto debemos hacer lo siguiente.

```bash
  node --version
```
El comando anterior te debe permitir conocer tu version de node.js (se recomienda que la version sea de la 20 en adelante), si no cuentas con node.js debe descargarlo en el siguiente enlace.

[NODE.JS](https://nodejs.org/es/download)

```bash
  npm --version
```

El comando anterior te debe permitir conocer tu version de npm (se recomienda que la version sea la mas actualizada posible), si no cuentas con NPM debe descargarlo en el siguiente enlace.

[NPM](https://www.npmjs.com/package/download)

Luego se debe genar la instalacion de Angular, esto debemos hacer con los siguientes comandos.

```bash
  npm install -g @angular/cli
  ng new SkyTracker
  cd SkyTracker
  Code .
  ng serve --open
```
Se sigue los pasos de acceso donde debes de aceptar el uso de tu informacion, el tipo de estilos a usar que en este caso se recomienda por defecto el uso de css

leugo accedees a tu proyecto y lo habres en tu entorno de desarrollo.

Para el uso de nuestros estilos decidimos usar la configuracion de tailwind.

```bash
 npm install tailwindcss @tailwindcss/postcss postcss  --force
```

luego dentro del poryecto se ejecutan los siguientes pasos.

## Screenshots

[Configure PostCSS Plugins](configt.png)

## Lenguajes de Programacion
[TypeScript](https://www.typescriptlang.org/)

## Frameworks

[Angular](https://angular.dev/)

[Tailwind Css](https://tailwindcss.com/)

## IDE
[VS code](https://code.visualstudio.com/)
## Carpetas

[Login](../app/login/login.component.html)

[Historial](../app/historial/historial.component.html)

[Main](../app/main/main.component.html)

