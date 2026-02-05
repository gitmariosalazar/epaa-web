# ==========================================
# Stage 1: Base
# ==========================================
FROM node:24-alpine AS base
WORKDIR /app

# Copia solo lo necesario para dependencias
COPY package*.json ./

# Usa npm ci (ya lo tienes, perfecto)
RUN npm ci --omit=dev  # ← cambio opcional: solo prod deps aquí si quieres ahorrar tiempo/caché
                       # Pero como luego copias todo, está bien dejar npm ci completo

# ==========================================
# Stage 2: Development (sin cambios, está bien)
# ==========================================
FROM base AS development
ENV NODE_ENV=development
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ==========================================
# Stage 3: Builder
# ==========================================
FROM base AS builder
ENV NODE_ENV=production

# Copia el resto del código
COPY . .

# Build (agrega --mode production si no lo tienes en vite.config)
RUN npm run build:prod

# Opcional: limpia caché de npm para achicar capa
RUN rm -rf ~/.npm

# ==========================================
# Stage 4: Production
# ==========================================
FROM nginx:alpine AS production

# Limpieza (ya lo tienes)
RUN rm -rf /usr/share/nginx/html/*

# Copia build (Vite usa /dist por defecto)
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]