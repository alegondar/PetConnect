## Context

El servidor Hono en `backend-node/src/index.ts` arranca por defecto en el puerto `8000`. En este entorno de desarrollo, Portainer ya ocupa ese puerto, causando un error `EADDRINUSE` al iniciar el backend. El código ya soporta `process.env.PORT` como mecanismo de configuración, por lo que el cambio es mínimo: ajustar el valor por defecto y propagar la actualización a todos los archivos que referencian el puerto.

El frontend usa Vite con proxy inverso en desarrollo (`vite.config.ts`) para redirigir peticiones `/api` al backend. La documentación (`docs/openapi.yaml`, `README.md`) también referencia `:8000`.

## Goals / Non-Goals

**Goals:**
- Cambiar el puerto por defecto del backend de `8000` a `8001` para eliminar la colisión con Portainer
- Mantener la variable de entorno `PORT` como mecanismo de override
- Actualizar todas las referencias al puerto en archivos de configuración activa y documentación del proyecto

**Non-Goals:**
- No se modifica el backend FastAPI deprecado (`backend/`)
- No se modifican documentos históricos de OpenSpec (cambios ya cerrados/archivados)
- No se cambia la arquitectura de proxy ni el patrón de comunicación frontend-backend

## Decisions

### Decisión 1: Usar `8001` como nuevo puerto por defecto

**Alternativas consideradas:**
- `3000`: puerto típico de Node/Express — también podría colisionar con otros proyectos
- `8080`: puerto alternativo común — Portainer a veces también lo usa como fallback
- `8001`: inmediatamente adyacente al actual, fácil de recordar, sin colisiones conocidas

**Decisión:** `8001`. Es el vecino inmediato de `8000`, minimiza la sorpresa para desarrolladores y no tiene conflictos con servicios comunes.

### Decisión 2: Mantener el patrón existente de `process.env.PORT`

El código actual ya implementa correctamente `const PORT = Number(process.env.PORT) || 8000`. Solo se cambia el fallback `8000` → `8001`. No se introduce nueva lógica ni librerías.

### Decisión 3: Actualizar solo archivos activos, no históricos

Los documentos de cambios ya cerrados en `openspec/changes/` son históricos y no deben modificarse. Solo se actualizan:
- Código fuente activo (`backend-node/`, `frontend/`)
- Documentación viva (`README.md`, `docs/openapi.yaml`)
- Archivos de configuración (`.env`, `.env.example`, `vite.config.ts`)

## Risks / Trade-offs

- **[Riesgo] Cambio breaking para URLs hardcodeadas**: Si algún script externo, CI/CD o desarrollador tiene `localhost:8000` hardcodeado, dejará de funcionar. → **Mitigación**: El cambio se documenta en el mensaje del commit como BREAKING y se actualiza toda referencia encontrada en el repositorio.
- **[Riesgo] `backend-worker` también referencia `PORT=8000`**: Si el worker se despliega localmente, también colisionaría. → **Mitigación**: Se actualiza también su `.env.example`.
