## 🃏 web-flash-card – Frontend

**web-flash-card** es la interfaz web del proyecto **Flash Card**, una SPA desarrollada con **React 19 + TypeScript + Vite** que permite generar mazos de flashcards de estudio usando modelos de **IA generativa** a través del microservicio `ms-flash-card`.

Está desplegada en **Firebase Hosting** y se comunica con el backend via API REST con formato **JSend**.

---

## 🧩 Estructura del Proyecto

```
src/
├─ app/
│   ├─ App.tsx              # Componente raíz
│   ├─ config/
│   │   └─ env.ts           # Variables de entorno (VITE_API_BASE_URL)
│   └─ layout/
│       └─ MainLayout.tsx   # Layout global (header + main)
│
├─ features/
│   └─ flashcards/          # Módulo principal
│       ├─ api/
│       │   └─ generateDeck.ts    # Llamada al endpoint POST /flashcards/generate
│       ├─ components/
│       │   ├─ FlashcardsForm.tsx   # Formulario de generación
│       │   ├─ FlashcardsList.tsx   # Listado de tarjetas del deck
│       │   └─ FlashcardsSkeleton.tsx # Estado de carga
│       ├─ hooks/
│       │   └─ useFlashcards.ts   # Estado y lógica del módulo
│       ├─ schemas.ts         # Validación Zod (input y respuesta del servidor)
│       ├─ types.ts           # Tipos: Deck, Flashcard, Difficulty
│       └─ FlashcardsPage.tsx # Página principal (layout en grid)
│
└─ shared/
    ├─ lib/
    │   ├─ httpClient.ts     # Cliente HTTP con manejo JSend (JSendFailError, JSendServerError)
    │   └─ jsend.ts          # Tipos de respuesta JSend
    ├─ styles/               # Estilos globales
    └─ validation/
        └─ zod-helpers.ts    # Helpers de tipado para errores de Zod
```

---

## ✨ Funcionalidades

- **Generación de flashcards**: formulario con campos `topic`, `difficulty` y proveedor de IA (`openai` | `gemini`).
- **Validación en cliente**: esquemas Zod con mensajes de error por campo antes de enviar al servidor.
- **Manejo de errores del servidor**: los errores JSend `fail` y `error` se mapean automáticamente a los campos del formulario.
- **Estado de carga**: skeleton animado mientras el backend genera el mazo.
- **Visualización del deck**: tarjetas con pregunta, respuesta, tag y dificultad.

---

## ⚙️ Ejecución Local

### 1️⃣ Requisitos previos

- Node.js ≥ **v22**
- pnpm ≥ **v9**
- Backend `ms-flash-card` ejecutándose en `http://localhost:3000`

### 2️⃣ Variable de entorno `.env`

```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

> En Docker con `nginx`, el proxy redirige `/api/` → `http://backend:3000/api/v1/`, por lo que no es necesaria esta variable.

### 3️⃣ Instalación y desarrollo

```bash
pnpm install
pnpm dev
```

La aplicación se ejecutará en:

> [http://localhost:5173](http://localhost:5173)

### 4️⃣ Build de producción

```bash
pnpm build
pnpm preview
```

---

## 🐳 Docker

El contenedor sirve la build estática mediante **Nginx** en el puerto `8080`.
El proxy Nginx reenvía las peticiones `/api/` al backend:

```nginx
location /api/ {
  proxy_pass http://backend:3000/api/v1/;
}
```

```bash
docker build -t web-flash-card .
docker run -p 8081:8080 web-flash-card
```

> Con `docker-compose` desde la raíz del monorepo el frontend queda disponible en `http://localhost:8081`.

---

## ☁️ Despliegue en Firebase Hosting

El proyecto está configurado para despliegue en **Firebase Hosting** (`firebase.json`).
El SPA mode está habilitado: todas las rutas redirigen a `index.html`.

```bash
pnpm build
firebase deploy --only hosting
```

URL de producción: `https://flash-card-e67ed.web.app`

---

## 🧱 Stack Técnico

| Componente        | Descripción                |
| ----------------- | -------------------------- |
| **Framework**     | React 19                   |
| **Lenguaje**      | TypeScript 5               |
| **Bundler**       | Vite 7                     |
| **Estilos**       | Tailwind CSS 4             |
| **Validación**    | Zod 4                      |
| **HTTP**          | Fetch API (cliente propio) |
| **Gestor**        | pnpm 9                     |
| **Servidor prod** | Nginx (Docker)             |
| **Hosting**       | Firebase Hosting           |

---

## 👨‍💻 Autor

Desarrollado por **Luis Felipe Carrasco (Pipe D Dev)**
💼 Arquitecto de Software | Cloud Engineer
🌐 [GitHub @pipeddev](https://github.com/pipeddev)
