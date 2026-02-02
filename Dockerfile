# ==========================================
# Stage 1: Base - Install dependencies
# ==========================================
FROM node:20-alpine AS base
WORKDIR /app

# Enable corepack for modern package management if needed (optional)
# RUN corepack enable

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install all dependencies (including devDependencies)
# We need devDependencies for the build step and for development
RUN npm ci

# ==========================================
# Stage 2: Development - Run dev server
# ==========================================
FROM base AS development
ENV NODE_ENV=development

# Expose Vite default port
EXPOSE 5173

# CMD will be overridden by docker-compose, but good default
CMD ["npm", "run", "dev", "--", "--host"]

# ==========================================
# Stage 3: Builder - Build the production bundle
# ==========================================
FROM base AS builder
ENV NODE_ENV=production

# Copy source code
COPY . .

# Run the build script defined in package.json
RUN npm run build -- --mode production

# ==========================================
# Stage 4: Production - Serve with Nginx
# ==========================================
FROM nginx:alpine AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
