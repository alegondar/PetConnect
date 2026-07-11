## Context

`backend-node/` funciona en Node.js localmente pero el equipo quiere desplegar en Cloudflare Workers para aprovechar el modelo serverless edge (latencia global, free tier, sin gestionar servidores). La auditoría `workers-compat-report.md` identificó los puntos de incompatibilidad y confirmó viabilidad.

**Restricción clave:** `backend-node/` no debe modificarse — debe seguir funcionando para desarrollo local con `tsx watch`. `backend-worker/` se crea como copia adaptada.

## Goals / Non-Goals

**Goals:**
- Crear `backend-worker/` como copia de `backend-node/` adaptada para Cloudflare Workers
- Reemplazar el entry point Node (`serve` + `listen`) por el modelo `export default { fetch }` de Workers
- Reemplazar `process.env` + `dotenv` por bindings `c.env` + `wrangler.toml`
- Mantener el 100% de los endpoints y schemas sin cambios funcionales
- `backend-node/` sigue intacto para desarrollo local en Node.js

**Non-Goals:**
- No se modifican endpoints, schemas, ni el contrato API
- No se cambia la lógica de negocio ni las queries a Supabase
- No se agregan nuevas features de Workers (Durable Objects, Queues, KV, R2)
- No se migra `backend/` (Python/FastAPI)

## Decisions

### 1. Copiar + adaptar vs modificar in-place

**Decisión:** Crear `backend-worker/` como copia de `backend-node/` y hacer cambios solo en la copia.

**Alternativa:** Modificar `backend-node/` para que soporte ambos runtimes con una abstracción condicional.

**Razón:** La compatibilidad bidireccional agrega complejidad innecesaria. Como `backend-node/` se usa activamente en desarrollo local, bifurcar en `backend-worker/` permite que cada proyecto tenga sus dependencias específicas sin conflictos. Además, `wrangler dev` es suficiente para testear Workers en local.

### 2. Supabase client factory vs singleton con global env

**Decisión:** Convertir `supabase.ts` de un módulo singleton (lee `process.env` al importarse) a una factory function `getSupabaseClients(env)` que recibe las credenciales como parámetro.

**Alternativa:** Usar `process.env` con `nodejs_compat` flag.

**Razón:** `nodejs_compat` es un polyfill que permite `process.env` y `Buffer` en Workers, pero no es la forma idiomática. El modelo nativo de Workers usa bindings `c.env` que son tipados y se inyectan por request. La factory function es más explícita, testeable, y no depende de side-effects de import.

**Implementación:**
```ts
// src/lib/supabase.ts (workers-safe)
export function getSupabaseClients(env: {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_KEY: string;
}) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
  const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });
  return { supabase, supabaseAdmin };
}
```

### 3. Buffer.from() en upload vs pasar File directo

**Decisión:** Eliminar `Buffer.from(buffer)` en `POST /pets/upload-photo` y pasar el `File` directamente a `.upload()`.

**Alternativa:** Activar `nodejs_compat` y mantener el `Buffer`.

**Razón:** El endpoint `POST /auth/avatar` ya demuestra que `File` se puede pasar directamente a Supabase Storage sin conversión intermedia. `Buffer.from()` es redundante y depende de `nodejs_compat`. Unificar ambos endpoints simplifica el código y elimina una dependencia de polyfill.

### 4. Hono Bindings tipados vs any

**Decisión:** Usar `Bindings` tipados con la interfaz de Hono para `c.env`.

**Implementación:**
```ts
type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_KEY: string;
  FRONTEND_ORIGIN: string;
};

const app = new Hono<{ Bindings: Bindings; Variables: { userId: string } }>();
```

**Razón:** TypeScript + Hono soportan tipado completo de `c.env` a través de `Bindings`. Esto da autocompletado y seguridad de tipos en todos los handlers, sin necesidad de aserciones.

### 5. Scripts auxiliares no se portan

**Decisión:** `scripts/import-veterinarias.ts` y `src/migrate.ts` se excluyen del build de Workers pero se mantienen en disco. No se importan desde `src/index.ts`, así que no necesitan cambios.

**Razón:** Son scripts de una sola ejecución que usan `fs`, `path`, `process.exit` — APIs no disponibles en Workers. Se ejecutan localmente con Node.js cuando sea necesario.

## Risks / Trade-offs

- **[Riesgo] Cold starts en Workers** → Mitigación: V8 isolates inician en <5ms, aceptable para una API REST. Si se vuelve un problema, Workers tiene `--minify` y `--no-bundle` para optimizar.
- **[Riesgo] CPU budget de Workers (10ms free, 30ms paid)** → Mitigación: Las queries a Supabase son I/O bound (no CPU bound). El tiempo de request real es el round-trip HTTP a Supabase, no el CPU del worker.
- **[Riesgo] Divergencia entre backend-node y backend-worker** → Mitigación: Mismo contrato `docs/openapi.yaml`. Si se agregan features nuevas, deben implementarse en ambos (o decidir deprecar `backend-node/`).
- **[Trade-off] `nodejs_compat` flag** → Se activa como red de seguridad (`Buffer`, algunas APIs de Node que puedan colarse), pero el código se escribe para no depender de él. Si en el futuro se puede remover, mejor.
- **[Trade-off] Secrets en `wrangler secret put`** → Las credenciales sensibles (SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY) no van en `wrangler.toml` sino como secrets encriptados de Cloudflare. Esto requiere configuración manual en el primer deploy.

## Migration Plan

1. Copiar `backend-node/` → `backend-worker/` (excluyendo `node_modules/` y `.env`)
2. Aplicar cambios de código (entry point, supabase, rutas, tsconfig)
3. Instalar dependencias con `pnpm install` dentro de `backend-worker/`
4. `wrangler login` para autenticar con Cloudflare
5. `wrangler secret put SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_KEY`
6. `wrangler dev` para prueba local
7. `wrangler deploy` para producción
8. Cambiar `FRONTEND_ORIGIN` en `wrangler.toml` al dominio real del frontend

**Rollback:** Si algo falla, `backend-node/` sigue funcionando sin cambios. El frontend puede apuntar al VPS original. Workers no se factura si no se usa.
