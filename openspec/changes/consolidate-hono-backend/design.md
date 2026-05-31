## Context

PetConnect completó la migración de FastAPI (Python) a Hono (TypeScript) en dos cambios (`migrate-backend-hono` y `complete-hono-migration`). El backend activo es `backend-node/` corriendo en `:8000` con rutas bajo `/api/v1`. Sin embargo, la documentación del proyecto aún referencia FastAPI/Python/uvicorn y el directorio `backend/` sigue presente sin indicación de su estado obsoleto.

El frontend React se comunica con el backend a través de un proxy de Vite (`/api` → `localhost:8000`) y usando `baseURL: '/api/v1'` en Axios, lo que hace la transición transparente siempre que ambos backends expongan las mismas rutas y contratos.

## Goals / Non-Goals

**Goals:**
- README.md debe reflejar Hono 4.7 + TypeScript 5.8 + Node.js como stack backend
- Confirmar que todas las llamadas API del frontend son compatibles con Hono
- `docs/openapi.yaml` debe identificar Hono como el servidor de desarrollo
- `backend/` debe tener un marcador claro de deprecación (`DEPRECATED.md`)
- No romper nada — el frontend debe seguir funcionando sin cambios en runtime

**Non-Goals:**
- No eliminar el directorio `backend/` ni su código
- No modificar rutas, contratos de API ni lógica de backend
- No cambiar la configuración del proxy de Vite (ya apunta a `:8000`)
- No modificar el deploy (Railway para backend, Vercel para frontend)
- No tocar `backend-node/` (ya es el backend canónico)

## Decisions

### 1. Archivo DEPRECATED.md en lugar de eliminar `backend/`

**Decisión:** Crear `backend/DEPRECATED.md` con fecha, motivo, y referencia al backend activo.

**Alternativa considerada:** Eliminar `backend/` directamente. Rechazada porque el código puede servir como referencia histórica y no hay urgencia de limpiar el repositorio. La eliminación puede hacerse en un cambio futuro cuando se confirme que nada depende de ese código.

### 2. No modificar el proxy de Vite

**Decisión:** Mantener `vite.config.ts` con proxy `/api` → `localhost:8000`. 

**Alternativa considerada:** Apuntar el proxy a `localhost:3000` (puerto por defecto de Hono). Rechazada porque `backend-node/` ya está configurado para correr en `:8000` (`PORT=8000`), manteniendo compatibilidad con el frontend existente.

### 3. Auditoría del frontend por patrón, no por archivo

**Decisión:** Buscar patrones de URL hardcodeada (`localhost:8000`, `localhost:3000`, `/api/v1`, `fastapi`, `python`, `uvicorn`) en todo `frontend/src/` con grep en lugar de revisar archivo por archivo.

**Alternativa considerada:** Revisar cada archivo manualmente. Rechazada por ineficiente — son 26 archivos `.ts/.tsx`. Una búsqueda con patrones es más exhaustiva y rápida.

### 4. README completo con nueva estructura

**Decisión:** Reescribir la sección de tecnologías y setup del README para reflejar:
- Backend: Hono 4.7 + TypeScript 5.8 + Node.js
- Backend activo: `backend-node/` (el directorio `backend/` queda deprecated)
- Setup con `pnpm install` unificado y `pnpm --filter petconnect-backend dev`

**Alternativa considerada:** Solo cambiar "FastAPI" por "Hono". Rechazada — el setup cambió completamente (ya no hay venv, pip, uvicorn), el README debe ser útil para un desarrollador nuevo.

### 5. OpenAPI: descripción genérica del servidor

**Decisión:** Cambiar la descripción del servidor de desarrollo en `openapi.yaml` de "Servidor local de desarrollo" a "Servidor local (Hono)" para identificar explícitamente el runtime.

**Alternativa considerada:** Dejar la descripción como está (es genérica y funciona). Rechazada — queremos ser explícitos sobre el stack para cualquier consumidor del OpenAPI.

## Risks / Trade-offs

- **[Riesgo]** Si hay URLs hardcodeadas en el frontend que apunten a FastAPI (ej: `localhost:8000/docs`) → **Mitigación:** la búsqueda con grep cubre todos los patrones conocidos. Si no se encuentra nada, el riesgo es nulo.
- **[Riesgo]** `PetConnect-Manual.md` podría contener referencias a FastAPI → **Mitigación:** revisar y actualizar si es necesario, igual que el README.
- **[Riesgo]** Romper compatibilidad con entornos de otros desarrolladores → **Mitigación:** el cambio es puramente documental y de marcado. El runtime no se modifica.
