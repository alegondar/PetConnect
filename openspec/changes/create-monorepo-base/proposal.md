## Why

PetConnect necesita una estructura de monorepo organizada para separar claramente el backend (FastAPI), frontend (React + Vite) y documentación, permitiendo desarrollo paralelo, integración continua y despliegue independiente de cada componente.

## What Changes

- Crear estructura de carpetas `backend/` con FastAPI (Python)
- Crear estructura de carpetas `frontend/` con React + Vite (JavaScript/TypeScript) usando pnpm
- Crear directorio `docs/` con un archivo `openapi.yaml` vacío como placeholder para documentación de API
- Crear `README.md` raíz con descripción del proyecto, tecnologías usadas e instrucciones básicas
- Configurar `.gitignore` raíz apropiado para Python, Node.js y documentación
- Archivo `pnpm-workspace.yaml` en raíz para gestionar el monorepo frontend

## Capabilities

### New Capabilities
- `backend-api`: API REST con FastAPI para el backend de PetConnect
- `frontend-app`: Aplicación web con React + Vite para el frontend de PetConnect
- `project-docs`: Documentación del proyecto incluyendo especificación OpenAPI

### Modified Capabilities
<!-- Ninguna, es el primer cambio del proyecto -->

## Impact

- Nuevo repositorio monorepo con estructura base
- Backend: Python, FastAPI, Uvicorn, dependencias en `requirements.txt` o `pyproject.toml`
- Frontend: React + Vite, TypeScript, pnpm como gestor de paquetes
- Documentación: OpenAPI 3.0 specs en `docs/openapi.yaml`
- No afecta sistemas existentes (proyecto nuevo)
