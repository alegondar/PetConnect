## Why

El proyecto migró de FastAPI a Hono en mayo 2026, de Tailwind v3 a v4, y de React 18 a 19, pero `openspec/config.yaml` sigue describiendo el stack viejo. Además, la existencia de tres carpetas de backend (`backend/`, `backend-node/`, `backend-worker/`) genera ambigüedad sobre dónde hacer cambios. Esto provoca que agentes nuevos o re-invocados tomen decisiones basadas en información incorrecta.

## What Changes

- Agregar sección "Reglas de carpetas de backend (crítico)" en `IDEA.md` que declare explícitamente qué backend es el activo, cuál está deprecado y cuál es solo para deploy.
- Actualizar `openspec/config.yaml`: backend Hono 4.7 + TypeScript 5.8, Tailwind CSS v4, React 19. Las reglas de estilo de proposal/design/tasks/specs se conservan sin cambios.

## Capabilities

### New Capabilities

- `project-docs`: Documentación raíz del proyecto que establece reglas de trabajo para agentes y refleja el stack tecnológico real.

### Modified Capabilities

<!-- Ninguna - no se modifican specs de funcionalidad existentes -->

## Impact

- `IDEA.md` — se agrega sección de reglas de carpetas (sin modificar contenido existente)
- `openspec/config.yaml` — se actualiza el bloque `context` (stack y estructura del monorepo)
