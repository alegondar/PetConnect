## Why

El proyecto migró completamente el backend de FastAPI a Hono en los cambios `migrate-backend-hono` y `complete-hono-migration`, pero la documentación oficial (README.md) y el directorio `backend/` aún reflejan el stack original con Python/FastAPI/Uvicorn. Esto genera confusión para nuevos desarrolladores y desalinea la documentación con el código activo. El frontend ya se comunica correctamente con Hono (`backend-node/`) vía proxy de Vite a `:8000/api/v1`, pero falta verificar que no queden referencias hardcodeadas al viejo backend.

## What Changes

- Actualizar README.md para reflejar Hono 4.7 + TypeScript 5.8 + Node.js como backend activo, eliminando referencias a FastAPI/Python/uvicorn
- Revisar todos los archivos del frontend (`frontend/src/`) confirmando que las llamadas API apuntan a `:8000/api/v1/*` (Hono)
- Actualizar `docs/openapi.yaml` — descripción del servidor para reflejar Hono como backend
- Crear `backend/DEPRECATED.md` marcando el directorio como en desuso, sin eliminarlo
- El backend de referencia es `backend-node/` (Hono + TypeScript + Zod + Supabase JS)

## Capabilities

### New Capabilities

- `update-readme-hono`: Documentación del stack real en README.md — Hono 4.7 + TypeScript 5.8 + Node.js, setup con pnpm, estructura actualizada del monorepo
- `audit-frontend-api`: Auditoría de todas las llamadas API en `frontend/src/` para confirmar compatibilidad con el backend Hono (`:8000/api/v1/*`)
- `update-openapi-server`: Actualizar metadata del servidor en `docs/openapi.yaml` reflejando Hono como backend
- `deprecate-fastapi-backend`: Marcar `backend/` como deprecated con archivo `DEPRECATED.md`, sin eliminar código

### Modified Capabilities

<!-- No hay capacidades existentes que modificar — openspec/specs/ está vacío -->

## Impact

- **Documentación**: `README.md`, `PetConnect-Manual.md` (si referencia FastAPI)
- **Docs/API**: `docs/openapi.yaml` (descripción del servidor)
- **Frontend**: `frontend/vite.config.ts` (proxy ya apunta a `:8000`, correcto), archivos en `frontend/src/` si hay URLs hardcodeadas
- **Backend deprecado**: Nuevo archivo `backend/DEPRECATED.md`
- **Backend activo**: `backend-node/` se consolida como único backend del proyecto
