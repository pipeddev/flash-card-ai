# ---------- Build ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ---------- Runtime ----------
FROM nginx:alpine

# Borra config default
RUN rm /etc/nginx/conf.d/default.conf

# Copia config propia
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
