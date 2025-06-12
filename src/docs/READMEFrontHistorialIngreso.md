# 📊 Interfaz de Usuario para el Historial de Inicios de Sesión (Front-end)

Este documento describe la interfaz visual (`user-history.component.html`) y la lógica asociada (`user-history.component.ts`) para consultar, ordenar y filtrar los usuarios registrados en la colección `user_logins` de Firestore en la aplicación SkyTracker.

## 🎯 Objetivo de la Interfaz

Proporcionar una vista clara y funcional que permita a los administradores del sistema:
* Visualizar todos los registros históricos de inicio de sesión de usuarios.
* Filtrar registros por fecha específica.
* Buscar registros por nombre de usuario o correo electrónico.
* Ordenar la tabla por diferentes columnas (nombre, correo, fecha/hora).
* Recargar los datos en tiempo real desde Firestore.

## 🎨 Diseño y Estilo (Tailwind CSS)

La interfaz está construida utilizando Tailwind CSS para un diseño moderno, responsivo y minimalista.

## 📄 Estructura del HTML (`user-history.component.html`)

El componente se divide en tres secciones principales:

1.  **Encabezado:** Título de la vista.
2.  **Controles de Filtro y Búsqueda:** Campos de entrada y botones para interactuar con los datos.
3.  **Tabla de Historial de Usuarios:** Presentación tabular de los datos.



