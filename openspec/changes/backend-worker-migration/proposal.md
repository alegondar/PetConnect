## Why

El backend actual (`backend-node/`) corre en Node.js con `@hono/node-server` y `dotenv`, lo que lo ata a un runtime tradicional (Railway, VPS). Queremos desplegar en Cloudflare Workers para aprovechar el modelo serverless edge: latencia global, escalado automático, y costo cero en free tier para la escala actual del proyecto. La auditoría de compatibilidad (`workers-compat-report.md`) confirmó que la migración es viable con cambios acotados (~3 estructurales, ~4 menores).

## What Changes

- Crear `backend-worker/` como copia adaptada de `backend-node/` (sin modificar el original)
- Reemplazar `serve()` + `@hono/node-server` por export `fetch` nativo de Workers
- Reemplazar `process.env` + `dotenv` por bindings `c.env` de Workers + `wrangler.toml`
- Refactorizar `src/lib/supabase.ts` de cliente singleton a factory function `getSupabaseClients(env)`
- Eliminar `Buffer.from()` redundante en upload de fotos de mascotas
- Actualizar `tsconfig.json` para módulos ESM + bundler resolution
- Agregar `wrangler.toml`, instalar `wrangler` y `@cloudflare/workers-types`
- `backend-node/` permanece intacto para desarrollo local continuo

## Capabilities

### New Capabilities
- No se crean nuevas capacidades de API. El contrato REST es idéntico al de `backend-node/`.

### Modified Capabilities
- No se modifican specs existentes. Los endpoints y schemas son los mismos.

## Impact

- Crea `backend-worker/` (~20 archivos nuevos basados en `backend-node/`)
- `backend-node/` sin modificaciones (coexisten ambos proyectos)
- `frontend/` sin cambios (mismas rutas `/api/v1/*`, apunta al mismo Supabase)
- `docs/openapi.yaml` sin cambios (el contrato API es idéntico)
- Nuevas devDependencies: `wrangler`, `@cloudflare/workers-types`
- Removidas de `backend-worker/`: `@hono/node-server`, `dotenv`
