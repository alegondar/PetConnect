## Context

El proyecto PetConnect arrancó con FastAPI como backend y Tailwind v3 en el frontend. En mayo 2026 se migró el backend a Hono (TypeScript), se actualizó el frontend a React 19 y Tailwind CSS v4, y se creó una copia de deploy (`backend-worker/`) para Cloudflare Workers. Sin embargo, `openspec/config.yaml` — que es lo primero que lee OpenSpec para dar contexto a los agentes — sigue describiendo el stack original. Tampoco existe documentación explícita sobre qué carpeta de backend es la activa.

Las consecuencias observadas: agentes que generan imports de FastAPI, referencias a Tailwind v3 (shadcn/ui), o modifican `backend-worker/` sin que el usuario lo haya solicitado.

## Goals / Non-Goals

**Goals:**
- Que `openspec/config.yaml` describa el stack real: Hono 4.7, React 19, Tailwind CSS v4.
- Que `IDEA.md` incluya una sección explícita con reglas de qué carpeta de backend tocar (y cuál no).
- Que cualquier agente, al leer el contexto del proyecto, sepa exactamente dónde trabajar.

**Non-Goals:**
- No se modifica código de backend ni frontend.
- No se cambia la estructura del monorepo.
- No se elimina `backend/` ni `backend-worker/` (solo se documenta su estado).
- No se cambian las reglas de estilo de proposal, design, tasks o specs del config.yaml.

## Decisions

### Decisión 1: Poner las reglas de carpetas en IDEA.md (no en config.yaml)

**Alternativa considerada:** Agregarlas al bloque `context` de `config.yaml`.

**Decisión:** `IDEA.md` es el archivo que los agentes deben leer primero (ya lo indica como "Sos un agente especializado..."). Es más visible y mantenible que el `context` del config.yaml, que es un bloque YAML multilínea difícil de editar. Las reglas de carpetas son instrucciones procedimentales, no contexto descriptivo.

### Decisión 2: No eliminar secciones obsoletas del config.yaml, solo actualizar los datos

**Alternativa considerada:** Reescribir completamente el bloque `context`.

**Decisión:** Conservar la estructura existente y solo reemplazar los valores desactualizados (nombres de stack, versiones, carpetas). Esto minimiza el riesgo de romper el parsing de OpenSpec y preserva las reglas de estilo que sí son correctas. Las secciones sobre RLS, Storage y convenciones se mantienen intactas.

### Decisión 3: Nombre del cambio: `sync-config-stack`

**Alternativa considerada:** `update-project-docs`, `fix-config-docs`.

**Decisión:** `sync-config-stack` describe mejor la acción (sincronizar configuración con el stack real) y es más específico que "update".

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| El config.yaml podría tener otros campos desactualizados no detectados | La revisión se limita al bloque `context`. Otros campos (rules, schema) no han cambiado. |
| En el futuro, otro cambio de stack requeriría otra actualización manual | `IDEA.md` ahora funciona como fuente de verdad secundaria; si se desincroniza de nuevo, será más fácil detectarlo. |
| `backend/` (FastAPI) sigue existiendo físicamente y podría confundir | La nueva sección en IDEA.md lo declara explícitamente deprecado. Eliminarlo físicamente queda fuera de scope. |

## Open Questions

- ¿Convendría en el futuro tener un script de validación que compare `config.yaml` contra `package.json` de cada workspace? Fuera de scope por ahora.
