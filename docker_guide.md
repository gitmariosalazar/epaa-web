# Docker Professional Setup Guide

This guide details the professional Docker configuration implemented for the epaa-web project.

## 🚀 Quick Start

### Development Environment

Use this for local development with Hot Module Replacement (HMR).

1. **Start Development Server:**

   ```bash
   docker compose up
   ```

   or in background mode (detached):

   ```bash
   docker compose up -d
   ```

   _Access the app at_ `http://localhost:5173`

2. **Stop Development Server:**

   ```bash
   docker compose down
   ```

3. **Rebuild Container:**
   (Run this if you install new npm packages)
   ```bash
   docker compose up --build
   ```

### Production Environment

Use this to simulate the production build served by Nginx.

1. **Build and Run Production:**

   ```bash
   docker compose -f docker-compose.prod.yml up --build -d
   ```

   _Access the app at_ `http://localhost:80`

2. **Stop Production:**
   ```bash
   docker compose -f docker-compose.prod.yml down
   ```

## 📂 Configuration Overview

### 1. Multi-Stage Dockerfile

The `Dockerfile` is optimized with 4 stages:

- **base**: Alpine Node image + cached dependencies.
- **development**: Runs `npm run dev`.
- **builder**: Compiles the app (`npm run build`).
- **production**: Minimal Nginx Alpine image serving static files.

### 2. VS Code / Development Notes

- Your local code changes will reflect instantly (HMR) because of the volume mapping in `docker-compose.yml`.
- `node_modules` is isolated in the container to prevent platform conflicts.

## 🛠 Useful Commands

| Action                    | Command                           |
| :------------------------ | :-------------------------------- |
| **Check Logs**            | `docker compose logs -f`          |
| **Enter Container Shell** | `docker exec -it epaa-web-dev sh` |
| **Prune Unused Images**   | `docker system prune`             |
| **Restart Service**       | `docker compose restart web`      |

> [!TIP]
> Always add `.dockerignore` to version control to ensure your builds are fast and don't include unnecessary files like `node_modules` or local git history.
