## ADDED Requirements

### Requirement: README reflects Hono backend stack
El README.md del proyecto SHALL reflejar `backend-node/` (Hono 4.7 + TypeScript 5.8 + Node.js) como el backend activo del proyecto. Todas las referencias a FastAPI, Python, Uvicorn, pip y venv como parte del stack activo SHALL ser eliminadas.

#### Scenario: New developer reads README
- **WHEN** un desarrollador nuevo abre el README.md
- **THEN** ve Hono + TypeScript + Node.js como stack backend, instrucciones de setup con `pnpm install` y `pnpm --filter petconnect-backend dev`, y la estructura del monorepo muestra `backend-node/` como directorio del backend activo

#### Scenario: README shows deprecated backend directory
- **WHEN** un desarrollador lee la estructura del monorepo en el README
- **THEN** el directorio `backend/` aparece listado pero marcado como deprecated, con referencia a `backend-node/` como reemplazo

#### Scenario: No FastAPI references remain
- **WHEN** se busca "FastAPI", "Python", "Uvicorn", "pip install", o "venv" en el README
- **THEN** no hay resultados que los refieran como stack activo del proyecto

### Requirement: README setup instructions use pnpm
Las instrucciones de setup en el README SHALL usar `pnpm` como gestor de paquetes unificado, eliminando las instrucciones con `pip` y `venv`.

#### Scenario: Developer follows backend setup
- **WHEN** un desarrollador sigue las instrucciones de setup del backend
- **THEN** ejecuta `pnpm install` desde la raíz y `pnpm --filter petconnect-backend dev` para iniciar el backend Hono
