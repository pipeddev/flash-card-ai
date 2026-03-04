## � ms-flash-card – Microservicio Backend

**ms-flash-card** es un microservicio backend desarrollado con **NestJS** bajo una arquitectura **Clean + Hexagonal**, que permite generar mazos de flashcards de estudio usando modelos de **IA generativa** (OpenAI GPT y Google Gemini), con autenticación JWT por dispositivo.

El servicio está optimizado para ejecución en **Google Cloud Run**, con pipeline CI/CD en **GitHub Actions** que valida calidad, pruebas y cobertura antes de cada merge.

---

## 🧩 Arquitectura del Proyecto

El proyecto implementa principios de **Domain-Driven Design (DDD)**, **Clean Architecture** y **Hexagonal Architecture**, separando las responsabilidades en capas claras:

```
src/
├─ auth/                     # Módulo de autenticación JWT por deviceId
│   ├─ application/          # Caso de uso: IssueTokenUseCase
│   ├─ domain/               # Entidad DeviceEntity, repositorio abstracto
│   ├─ infrastructure/       # Adaptador JWT (JwtAuthService)
│   └─ interface/            # AuthController + IssueTokenDto
│
├─ flashcards/               # Módulo principal del dominio FlashCards
│   ├─ application/          # Caso de uso: GenerateDeckUseCase
│   ├─ domain/               # Entidades (Deck, Flashcard), enums, repositorios
│   ├─ infrastructure/       # Adaptadores IA (OpenAI, Gemini) + repo en memoria
│   └─ interface/            # FlashcardsController + GenerateDeckDto
│
├─ health/                   # Health check del servicio
├─ shared/                   # Logger, pipes, filtros, decoradores, utils comunes
│
├─ app.module.ts             # Módulo raíz de NestJS
├─ main.ts                   # Bootstrap (FastifyAdapter + CORS + versionado URI)
└─ constant.ts               # Constantes globales
```

📘 **Principios aplicados:**

- **Clean Architecture:** cada capa tiene una responsabilidad única.
- **Hexagonal (Ports & Adapters):** el dominio no depende de frameworks ni proveedores externos.
- **DDD:** las entidades y reglas de negocio son independientes de la infraestructura.
- **Inyección de dependencias:** los adaptadores se registran a través de tokens de interfaz.

---

## 🤖 Proveedores de IA

El servicio soporta múltiples proveedores de IA para la generación de flashcards, seleccionables por solicitud:

| Provider | Modelo por defecto     | Enum     |
| -------- | ---------------------- | -------- |
| OpenAI   | `gpt-4o-mini`          | `openai` |
| Google   | `gemini-3-pro-preview` | `gemini` |

La selección se realiza mediante el patrón **Factory** (`AiProviderFactory`).

---

## 🌐 Endpoints de la API

El versionado de la API usa prefijo URI: `/api/v{version}`.

### Auth

| Método | Ruta                 | Descripción                            | Auth |
| ------ | -------------------- | -------------------------------------- | ---- |
| `POST` | `/api/v1/auth/token` | Emite un JWT asociado a un dispositivo | ❌   |

**Body `POST /auth/token`:**

```json
{
  "deviceId": "uuid-v4-del-dispositivo"
}
```

### Flashcards

| Método | Ruta                          | Descripción                         | Auth |
| ------ | ----------------------------- | ----------------------------------- | ---- |
| `POST` | `/api/v1/flashcards/generate` | Genera un mazo de flashcards con IA | ✅   |
| `GET`  | `/api/v1/flashcards/:id`      | Obtiene un mazo por su ID           | ✅   |

**Body `POST /flashcards/generate`:**

```json
{
  "topic": "Historia de Roma",
  "difficulty": "intermediate",
  "provider": "openai"
}
```

> `difficulty`: `basic` | `intermediate` | `advanced` > `provider`: `openai` | `gemini`

**Respuesta (JSend):**

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "topic": "Historia de Roma",
    "difficulty": "intermediate",
    "cards": [
      {
        "question": "¿En qué año cayó el Imperio Romano de Occidente?",
        "answer": "476 d.C.",
        "difficulty": "intermediate",
        "tag": "historia"
      }
    ]
  }
}
```

### Health

| Método | Ruta             | Descripción         |
| ------ | ---------------- | ------------------- |
| `GET`  | `/api/v1/health` | Estado del servicio |

---

## 🔀 GitFlow Simplificado

- `feature/*` → nuevas funcionalidades
- `bugfix/*` → correcciones menores
- `hotfix/*` → correcciones críticas en producción
- `develop` → entorno de integración
- `main` → entorno estable / producción

---

## ⚙️ Ejecución Local

### 1️⃣ Requisitos previos

- Node.js ≥ **v22**
- pnpm ≥ **v9**
- Clave de API de OpenAI y/o Google Gemini

### 2️⃣ Variables de entorno `.env`

```bash
APP_NAME=ms-flash-card
APP_PORT=3000
APP_ENV=development

# OpenAI
OPENAI_API_KEY=tu_openai_api_key
OPENAI_MODEL=gpt-4o-mini

# Google Gemini
GEMINI_API_KEY=tu_gemini_api_key
GEMINI_MODEL=gemini-3-pro-preview

# JWT
JWT_SECRET=super_secret_key_change_me
JWT_EXPIRES_IN=1h

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100

# Logging
LOG_LEVEL=debug
```

### 3️⃣ Instalación

```bash
pnpm install
pnpm start:dev
```

La aplicación se ejecutará en:

> [http://localhost:3000](http://localhost:3000)

---

## 🐳 Docker

### Ejecución con Docker Compose (proyecto completo)

```bash
# Desde la raíz del monorepo
docker-compose up --build
```

Servicios levantados:

| Servicio   | Puerto local | Descripción       |
| ---------- | ------------ | ----------------- |
| `backend`  | `3000`       | ms-flash-card API |
| `frontend` | `8081`       | web-flash-card    |

### Ejecución solo del backend

```bash
# Desde ms-flash-card/
docker build -t ms-flash-card .
docker run --env-file .env -p 3000:3000 ms-flash-card
```

El Dockerfile usa **multi-stage build** (Node.js 22 Alpine):

- **Etapa 1 (builder):** instala dependencias y compila TypeScript.
- **Etapa 2 (runner):** solo dependencias de producción + `dist/`.

---

## 🧪 Calidad y Testing

El proyecto usa **Jest** con cobertura mínima exigida de **80%**
(validada automáticamente por **GitHub Actions** antes de cada merge).

```bash
# Tests unitarios
pnpm test

# Tests con cobertura
pnpm test:cov

# Tests e2e
pnpm test:e2e
```

📄 **Pipeline CI:** `.github/workflows/ci-feature-validation.yml`

- Lint (ESLint)
- Tests unitarios
- Verificación de cobertura mínima (80%)
- Bloqueo automático de merges si no cumple el umbral ✅

---

## ☁️ Despliegue en Cloud Run

- Imágenes Docker optimizadas con Node.js 22 + pnpm
- Despliegue sin estado en Google Cloud Run
- CORS configurado para el frontend en Firebase Hosting


## 🧱 Stack Técnico

| Componente          | Descripción                  |
| ------------------- | ---------------------------- |
| **Framework**       | NestJS 11 + Fastify          |
| **Lenguaje**        | TypeScript 5                 |
| **Runtime**         | Node.js 22                   |
| **Gestor**          | pnpm 9                       |
| **IA**              | OpenAI GPT + Google Gemini   |
| **Auth**            | JWT (passport-jwt)           |
| **Testing**         | Jest + Supertest             |
| **CI/CD**           | GitHub Actions               |
| **Infraestructura** | Google Cloud Run + Terraform |
| **Arquitectura**    | DDD + Clean + Hexagonal      |

---

## 👨‍💻 Autor

Desarrollado por **Luis Felipe Carrasco (Pipe D Dev)**
💼 Arquitecto de Software | Cloud Engineer
🌐 [GitHub @pipeddev](https://github.com/pipeddev)
