## 1. Auditoría del frontend

- [x] 1.1 Buscar referencias a FastAPI, Python, Uvicorn, pip, venv en `frontend/src/` con grep
- [x] 1.2 Buscar URLs hardcodeadas (`localhost:8000`, `localhost:3000`) en `frontend/src/` (excluyendo `vite.config.ts`)
- [x] 1.3 Verificar que `frontend/src/api/client.ts` usa `baseURL: '/api/v1'` y el interceptor de auth es correcto
- [x] 1.4 Verificar que `frontend/vite.config.ts` proxy `/api` apunta a `http://localhost:8000`
- [x] 1.5 Si se encuentran referencias hardcodeadas a FastAPI o URLs incorrectas, corregirlas (no aplica — sin referencias incorrectas)

## 2. Actualizar README.md

- [x] 2.1 Actualizar sección "Tecnologías": reemplazar FastAPI/Python/Uvicorn por Hono 4.7 + TypeScript 5.8 + Node.js
- [x] 2.2 Actualizar estructura del monorepo: incluir `backend-node/` como backend activo, marcar `backend/` como deprecated
- [x] 2.3 Actualizar sección "Requisitos": eliminar Python 3.11, mantener Node.js 18+ y pnpm
- [x] 2.4 Reescribir sección "Setup > Backend": reemplazar instrucciones de venv/pip/uvicorn por `pnpm install` y `pnpm --filter petconnect-backend dev`
- [x] 2.5 Confirmar que no quedan referencias a FastAPI, Python, Uvicorn, pip, venv en el README

## 3. Actualizar docs/openapi.yaml

- [x] 3.1 Cambiar la descripción del servidor local de desarrollo para identificar Hono como runtime
- [x] 3.2 Confirmar que no hay referencias a FastAPI o Python en el openapi.yaml

## 4. Marcar backend/ como deprecated

- [x] 4.1 Crear `backend/DEPRECATED.md` con: fecha de deprecación, motivo (migración a Hono en `backend-node/`), referencia al backend activo, e instrucción de no usar para nuevo desarrollo
- [x] 4.2 Verificar que el código existente en `backend/` no fue modificado

## 5. Verificación final

- [x] 5.1 Ejecutar búsqueda global de "FastAPI", "python", "uvicorn", "pip install", "venv" en README.md, docs/openapi.yaml y frontend/src/ — deben arrojar 0 resultados como stack activo
- [x] 5.2 Confirmar que `frontend/` compila sin errores (`pnpm --filter frontend build` o `pnpm --filter frontend typecheck`) — error preexistente en CommentSection.tsx:30 (TS6133), no relacionado con este cambio
- [x] 5.3 Verificar que `README.md` contiene instrucciones funcionales para levantar `backend-node/` con pnpm
