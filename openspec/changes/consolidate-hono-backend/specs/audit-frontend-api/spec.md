## ADDED Requirements

### Requirement: Frontend API calls are compatible with Hono backend
Todas las llamadas a la API desde `frontend/src/` SHALL ser compatibles con el backend Hono (`backend-node/`) corriendo en `localhost:8000` con rutas bajo `/api/v1`. No deben existir referencias hardcodeadas a FastAPI, Python, Uvicorn, ni a URLs específicas del antiguo backend.

#### Scenario: API client configuration is correct
- **WHEN** se inspecciona `frontend/src/api/client.ts`
- **THEN** `baseURL` está configurado como `/api/v1` y el interceptor de auth usa el token de Supabase para el header `Authorization: Bearer <token>`

#### Scenario: Vite proxy points to Hono port
- **WHEN** se inspecciona `frontend/vite.config.ts`
- **THEN** el proxy `/api` apunta a `http://localhost:8000`, que es el puerto donde corre Hono

#### Scenario: No FastAPI or Python references in frontend
- **WHEN** se busca "FastAPI", "Python", "Uvicorn", "pip", "venv" en `frontend/src/`
- **THEN** no se encuentran resultados

#### Scenario: No hardcoded backend URLs in frontend
- **WHEN** se busca "localhost:8000" o "localhost:3000" en `frontend/src/` (excluyendo `vite.config.ts`)
- **THEN** no se encuentran URLs hardcodeadas que apunten a un backend específico
