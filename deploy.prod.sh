#!/bin/bash

# Script de despliegue automático para EPAA Web (Producción)
# Este script construye la imagen y levanta los contenedores usando docker-compose.prod.yml

# Detener la ejecución si ocurre un error
set -e

echo "----------------------------------------------------------"
echo "🚀 Starting production deployment of EPAA Web..."
echo "----------------------------------------------------------"

# 1. Verificar si existe el archivo .env
if [ ! -f .env ]; then
    echo "❌ Error: The .env file does not exist."
    echo "Make sure you have a .env file configured."
    exit 1
fi

# 2. (Opcional) Actualizar código fuente desde Git
# If you want the script to update the code before deploying, uncomment the following lines:
# echo "📥 Actualizando código desde el repositorio..."
# git pull origin main

# 3. Build and start containers
echo "🏗️  Building and starting containers..."
# We use -f to specify the production file
# --build ensures the image is rebuilt with the latest changes and environment variables
docker compose -f docker-compose.prod.yml -p epaa-web-prod up -d --build

# 4. Limpieza de recursos antiguos
echo "🧹 Cleaning up old resources..."
# This removes images that were left without a tag after the new build
docker image prune -f

echo "----------------------------------------------------------"
echo "✅ Production deployment completed successfully."
echo "🌐 The application should be running on port 3000."
echo "   You can check the status with: docker ps"
echo "----------------------------------------------------------"
