## Why

PetConnect necesita agentes especializados de OpenCode para automatizar el desarrollo full-stack de forma orquestada, desde el diseño de base de datos hasta la revisión de código y testing, garantizando coherencia entre capas y flujo de trabajo reproducible.

## What Changes

- Crear 9 agentes markdown en `.opencode/agents/` con roles bien definidos
- Cada agente especifica: descripción, responsabilidades, inputs, outputs y orden de ejecución
- El agente orquestador coordina el flujo secuencial: db → openapi → backend + frontend → tester → reviewer → documenter
- El agente diseñador se ejecuta antes del frontend para establecer la guía visual

## Capabilities

### New Capabilities
- `orchestrator-agent`: Agente principal que coordina y delega tareas al resto de agentes en orden predefinido
- `db-agent`: Diseña el schema PostgreSQL en `docs/db_schema.sql` basado en los features de PetConnect
- `openapi-agent`: Genera `docs/openapi.yaml` completo a partir de db_schema.sql
- `backend-agent`: Implementa endpoints FastAPI basándose en `docs/openapi.yaml`
- `frontend-agent`: Implementa la UI con React + Vite + Tailwind basándose en `docs/openapi.yaml`
- `designer-agent`: Define paleta de colores, componentes UI y estilo visual mobile-first
- `tester-agent`: Genera tests para backend (pytest) y frontend (vitest)
- `reviewer-agent`: Revisa código, detecta errores y sugiere mejoras
- `documenter-agent`: Genera documentación técnica, `CHECKLIST.md` y actualiza `README.md`

## Impact

- Nuevo directorio `.opencode/agents/` con 9 archivos `.md`
- Sin impacto en código existente (solo configuración de OpenCode)
- Habilita el flujo de desarrollo automático: `orchestrator → db → openapi → backend + frontend → tester → reviewer → documenter`
