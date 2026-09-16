# Evaluación Práctica: Asincronía y Manejo de APIs en JavaScript

Proyecto desarrollado para el programa **Técnico en Programación de Software - SENA**. Consiste en un sistema de consola modularizado que interactúa de manera asíncrona con la API pública de `JSONPlaceholder`.

---

## 🚀 Características
* **Asincronía Moderna:** Uso de `async/await`, `fetch` y consumo paralelo con `Promise.all`.
* **Arquitectura Modular:** Separación de responsabilidades por módulos independientes e integración mediante archivo barril (`src/index.js`).
* **Menú Interactivo:** CLI interactiva implementada en `src/app.js` mediante la librería nativa `readline`.
* **Inmutabilidad y Calidad:** Protección de datos mediante `Object.freeze()` y control de excepciones estructurado con `try/catch`.

---

## 🛠️ Tecnologías Utilizadas
* **Entorno de Ejecución:** Node.js (ES Modules)
* **API:** JSONPlaceholder
* **Control de Versiones:** Git & GitHub (Flujo Git Flow)

---

## 📂 Estructura del Proyecto

```text
├── docs/
│   ├── DOCUMENTACION_TECNICA.md
│   └── PRUEBAS_Y_EVALUACION.md
├── src/
│   ├── modules/
│   │   ├── enrichUsers.js
│   │   ├── filterPosts.js
│   │   ├── mapUsers.js
│   │   ├── pendingTasks.js
│   │   └── userAlbums.js
│   ├── app.js
│   └── index.js
├── .gitignore
├── package.json
└── README.md
