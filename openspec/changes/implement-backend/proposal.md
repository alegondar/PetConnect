## Why

El frontend necesita una API real para consumir datos. Sin el backend implementado según `docs/openapi.yaml`, el contrato definido queda como documentación sin ejecución. Es el paso que habilita el desarrollo paralelo con frontend-agent.

## What Changes

- Actualizar `backend/requirements.txt` con supabase, python-jose, httpx
- Crear estructura `backend/app/{routers,models,services,config,core}/`
- Implementar ~47 operaciones distribuidas en 7 routers
- Integrar Supabase (auth JWT + database) con supabase-py
- Configurar CORS, middleware de auth y manejo de errores HTTP

## Capabilities

### New Capabilities
- `backend-core`: Configuración de FastAPI, Supabase client, CORS, middleware de auth JWT, paginación genérica
- `backend-auth`: Router auth con register, login y profile usando Supabase Auth
- `backend-pets`: Routers de pets, vet-visits y pet-events con servicios CRUD
- `backend-social`: Routers de feed (posts, likes, comments) con contadores
- `backend-ranking`: Endpoint de ranking semanal desde vista materializada
- `backend-community`: Routers de lost-pets (geolocalización) y adoptions
- `backend-instapet`: Routers de InstaPet social (posts, followers, milestones)

## Impact

- Modifica `backend/requirements.txt`, `backend/app/main.py`
- Crea ~20 archivos nuevos en `backend/app/`
- Sin impacto en frontend ni docs
