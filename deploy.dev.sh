#!/bin/bash

# Script de desarrollo para EPAA Web
# Levanta el entorno con Hot Module Replacement (HMR) para reflejar cambios en tiempo real

# Detener la ejecución si ocurre un error
set -e

echo "----------------------------------------------------------"
echo "🛠️  Starting Development environment (Vite + HMR)..."
echo "----------------------------------------------------------"

# 1. Verificar si existe el archivo .env
if [ ! -f .env ]; then
    echo "❌ Error: The .env file does not exist."
    echo "Make sure you have a .env file configured."
    exit 1
fi

# 2. Levantar contenedores de desarrollo
# -p epaa-web-dev separates this project from the production one
echo "🏗️  Building and starting development containers..."
docker compose -f docker-compose.yml -p epaa-web-dev up -d --build

echo "----------------------------------------------------------"
echo "✅ Development environment ready."
echo "🌐 Access at: http://localhost:5173"
echo "📝 Changes in the code will be reflected instantly."
echo "----------------------------------------------------------"

# 3. Mostrar logs en tiempo real para monitorear cambios
echo "📋 Showing application logs (Press Ctrl+C to stop following logs, the container will continue running):"
docker compose -p epaa-web-dev logs -f web
