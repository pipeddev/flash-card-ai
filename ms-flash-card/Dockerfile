# Etapa 1: Build
FROM node:22-alpine AS builder

# Habilitar corepack para usar pnpm
RUN corepack enable

WORKDIR /app

# Copiamos manifest primero para aprovechar cache
COPY package.json pnpm-lock.yaml ./

# Instalamos dependencias de desarrollo
RUN pnpm install --frozen-lockfile

# Copiamos el resto del código
COPY . .

# Compilamos Nest (dist/)
RUN pnpm build

# Etapa 2: Runtime
FROM node:22-alpine AS runner

RUN corepack enable

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Sólo dependencias de producción
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copiamos el build ya compilado
COPY --from=builder /app/dist ./dist

# Si usas archivos como env config, cópialos acá si aplica
# COPY .env.production ./.env

# Cloud Run inyecta PORT, Nest debe escuchar en process.env.PORT
EXPOSE 3000

CMD ["pnpm", "start:prod"]
