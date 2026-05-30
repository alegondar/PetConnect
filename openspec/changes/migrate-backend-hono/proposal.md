## Why

El backend actual está en Python/FastAPI, pero el ecosistema del proyecto (frontend React + Vite + Tailwind, monorepo pnpm) ya opera en TypeScript. Migrar a Hono + TypeScript:

- **Stack unificado**: Un solo lenguaje (TypeScript) en frontend y backend reduce fricción cognitiva y permite compartir tipos
- **Live reload nativo**: `tsx watch` vs el overhead de uvicorn con --reload
- **Menos dependencias**: Hono es ~30KB, FastAPI + uvicorn + pydantic + dependencias pesa ~100MB en virtualenv
- **Supabase JS SDK nativo**: Mejor integración que supabase-py (el SDK JS oficial recibe updates primero)
- **Despliegue simplificado**: Un solo runtime (Node.js), sin necesidad de Python + pip + virtualenv

## What Changes

- Crear `backend-node/` con estructura Hono + TypeScript (NO tocar `backend/` existente)
- Implementar los mismos ~41 endpoints del OpenAPI spec en `docs/openapi.yaml`
- Zod schemas por módulo con validación automática vía `@hono/zod-validator`
- Middleware de auth JWT vía `supabase.auth.getUser(token)` — mismo mecanismo que el frontend
- Puerto 8000 (mismo que FastAPI) para no cambiar la configuración del frontend
- CLI: `npx tsx src/index.ts` / `npx tsx watch src/index.ts`

## Capabilities

### New Capabilities

- `hono-core`: Entry point, CORS, Supabase client, middleware de auth JWT, paginación genérica
- `hono-auth`: Router auth (register, login, get/update profile) con Supabase Auth
- `hono-pets`: Routers de pets, vet-visits y pet-events con CRUD
- `hono-feed`: Routers de feed social (posts, likes, comments) con contadores
- `hono-ranking`: Endpoint de ranking semanal
- `hono-community`: Routers de lost-pets (geolocalización) y adoptions
- `hono-instapet`: Routers de InstaPet social (posts, followers, milestones)
- `hono-petfriendly`: Endpoint de lugares pet-friendly (del change `pet-friendly-places`)

## Impact

- Crea `backend-node/` (~20 archivos nuevos)
- `backend/` permanece intacto hasta verificar migración completa
- `frontend/` sin cambios (mismo puerto 8000, mismas rutas `/api/v1/*`)
- `docs/openapi.yaml` sin cambios (el contrato es el mismo)
- `pnpm-workspace.yaml`: agregar `backend-node/` al workspace (opcional, para scripts compartidos)
