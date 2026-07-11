# Cloudflare Workers Compatibility Report — PetConnect Backend

> **Auditado:** `backend-node/` (Hono 4.7 + TypeScript)
> **Fecha:** 2026-07-10

---

## 1. Entry point / bootstrap del server

| Ítem | Archivo | Estado |
|---|---|---|
| `serve()` de `@hono/node-server` con `.listen()` | `src/index.ts:5, 53-60` | 🔴 **Node-only** |
| `import "dotenv/config"` (side-effect import) | `src/index.ts:1` | 🔴 **Node-only** |
| `app.onError()` + `console.error` | `src/index.ts:34-37` | 🟢 OK (Web standard) |
| Rutas montadas con `app.route()` | `src/index.ts:39-49` | 🟢 OK (Hono nativo) |

**Detalle:** El entry point actual hace `serve({ fetch: app.fetch, port: PORT })` que levanta un `http.Server` de Node.js via `@hono/node-server`. En Workers el modelo es distinto: se exporta el objeto worker con `export default { fetch: app.fetch }`, sin puerto ni listen.

**Fix necesario:**
```ts
// src/index.ts — versión Workers
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
// ... rutas ...

const app = new Hono();
// ... middleware y rutas ...

export default app;  // Workers auto-detecta app.fetch
```

---

## 2. Conexión a Supabase/Postgres

| Ítem | Archivo | Estado |
|---|---|---|
| `@supabase/supabase-js` (cliente HTTP) | `src/lib/supabase.ts` | 🟢 **Workers-compatible** |
| `persistSession: false` | `src/lib/supabase.ts:9, 13` | 🟢 Correcto |
| Drivers TCP (`pg`, `node-postgres`) | — | ✅ No se usan |

**Detalle:** Toda la comunicación con Supabase es vía HTTP REST usando el SDK oficial `@supabase/supabase-js`. No hay drivers TCP directos. Esto funciona en Workers sin problema. Las queries son seguras (usan el query builder con parámetros, no string interpolation).

---

## 3. APIs de Node.js usadas

| API | Archivo(s) | Estado |
|---|---|---|
| `process.env.*` (7 ocurrencias) | `index.ts`, `supabase.ts`, `pets.ts` | 🔴 **Node-only** |
| `import "dotenv/config"` | `index.ts:1`, `supabase.ts:1` | 🔴 **Node-only** |
| `Buffer.from(buffer)` | `pets.ts:30` | 🟡 **`nodejs_compat` requerido; refactorizable** |
| `import.meta.dirname` | `scripts/import-veterinarias.ts:18` | 🔴 Script auxiliar |
| `fs.readFileSync` | `scripts/import-veterinarias.ts:2` | 🔴 Script auxiliar |
| `path.resolve` | `scripts/import-veterinarias.ts:3` | 🔴 Script auxiliar |
| `process.exit()` | `scripts/import-veterinarias.ts` | 🔴 Script auxiliar |
| `crypto.randomUUID()` | `pets.ts:26` | 🟢 **Web Crypto API** (nativo en Workers) |
| `console.log/error/warn` | varios | 🟢 OK (Web standard) |
| `new Date().toISOString()` | `notifications.ts:44` | 🟢 OK (Web standard) |

**Análisis:**
- `process.env` debe migrarse a **bindings de Workers** (`c.env.VARIABLE` dentro de handlers, o `env` parameter en `fetch`). `dotenv` desaparece completamente.
- `Buffer.from()` se puede eliminar fácilmente: el endpoint `POST /pets/upload-photo` convierte el archivo a `ArrayBuffer` y luego a `Buffer` innecesariamente. El endpoint `POST /auth/avatar` ya demuestra el patrón correcto: pasa el `File` directamente a `supabase.storage.upload()`. Solo hay que unificar.
- `import.meta.dirname`, `fs`, `path`, `process.exit` están solo en `scripts/import-veterinarias.ts` y `src/migrate.ts`, que son **scripts de una sola ejecución** (no parte del servidor runtime). No bloquean el deploy.

---

## 4. Manejo de archivos / uploads

| Endpoint | Archivo | Método | Estado |
|---|---|---|---|
| `POST /auth/avatar` | `auth.ts:218-253` | `formData()` → `storage.upload(path, file)` | 🟢 **In-memory, Workers-safe** |
| `POST /pets/upload-photo` | `pets.ts:15-41` | `file.arrayBuffer()` → `Buffer.from(buffer)` → `storage.upload()` | 🟡 **Usa Buffer innecesariamente** |

**Detalle:** El upload de avatar ya usa el flujo correcto: obtiene el `File` del `formData()` (que en Workers y en Hono es un `File` web nativo) y lo pasa directamente al SDK de Supabase Storage. No hay escritura a disco temporal.

El upload de fotos de mascotas tiene un paso extra redundante (`arrayBuffer` → `Buffer.from`) que se puede eliminar para que quede idéntico al de avatar. Sin `nodejs_compat`, `Buffer` no existe en Workers.

**Fix:** Reemplazar las líneas 24-31 de `pets.ts`:
```ts
// Antes (usa Buffer)
const buffer = await file.arrayBuffer();
const path = `...`;
await supabaseAdmin.storage.from("pets").upload(path, Buffer.from(buffer), { ... });

// Después (workers-safe, igual que avatar)
const path = `...`;
await supabaseAdmin.storage.from("pets").upload(path, file, { ... });
```

---

## 5. Variables de entorno

| Ubicación | Uso actual | Workers equivalent |
|---|---|---|
| `src/index.ts:20` | `process.env.FRONTEND_ORIGIN` | `c.env.FRONTEND_ORIGIN` (o binding en `wrangler.toml`) |
| `src/index.ts:21` | `process.env.PORT` | **No aplica** en Workers (sin puerto) |
| `src/lib/supabase.ts:4-6` | `process.env.SUPABASE_URL`, `_ANON_KEY`, `_SERVICE_KEY` | `c.env.SUPABASE_URL`, etc. |
| `src/routes/pets.ts:39` | `process.env.SUPABASE_URL` | `c.env.SUPABASE_URL` |

**Detalle:** En Workers las variables de entorno son **bindings** accesibles desde el contexto de request (`c.env`) o desde el objeto `env` del handler `fetch(request, env, ctx)`. No existe `process.env`.

**Estrategia de migración recomendada:**
1. Usar `wrangler.toml` con `[vars]` para definir las variables (solo valores no secretos).
2. Usar `wrangler secret put SUPABASE_SERVICE_KEY` para valores secretos.
3. Refactorizar `supabase.ts` para que reciba las variables como parámetro en lugar de leerlas del ambiente global. Ejemplo:
```ts
// src/lib/supabase.ts (workers-safe)
import { createClient } from "@supabase/supabase-js";

export function getSupabaseClients(env: {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_KEY: string;
}) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });
  return { supabase, supabaseAdmin };
}
```
4. Pasar `env` desde el handler de cada ruta usando `c.env` (con los Hono bindings tipados).

---

## 6. Dependencias del `package.json`

| Dependencia | Workers-compatible | Notas |
|---|---|---|
| `@hono/node-server` ^2.0.4 | 🔴 No | **Eliminar** para Workers. Solo sirve para `serve()` en Node. |
| `@hono/zod-validator` ^0.4.2 | 🟢 Sí | Middleware Hono, edge-native. |
| `@supabase/supabase-js` ^2.49.1 | 🟢 Sí | HTTP-only, sin dependencias nativas. |
| `dotenv` ^17.4.2 | 🔴 No | **Eliminar** para Workers. Reemplazado por `wrangler.toml` + secrets. |
| `fast-xml-parser` ^5.8.0 | 🟢 Sí | Pure JS. Solo usado en script de import, no en runtime. Mover a devDeps. |
| `hono` ^4.7.5 | 🟢 Sí | Framework edge-native por diseño. |
| `jszip` ^3.10.1 | 🟢 Sí | Pure JS (funciona en browser). Solo usado en script de import. Mover a devDeps. |
| `zod` ^3.24.2 | 🟢 Sí | Pure JS, sin dependencias nativas. |

**DevDependencies:**

| Dependencia | Workers-compatible | Notas |
|---|---|---|
| `@types/jszip` ^3.4.1 | 🟢 Sí | Solo tipos. |
| `@types/node` ^22.14.0 | 🟡 Parcial | Tipos de Node.js; en Workers se usa `@cloudflare/workers-types`. |
| `tsx` ^4.19.3 | 🔴 No | Runner Node.js para dev. Reemplazar por `wrangler dev`. |
| `typescript` ^5.8.3 | 🟢 Sí | Compilador, no va al bundle. |

---

## 7. WebSockets / long-lived connections

| Patrón | Encontrado | Estado |
|---|---|---|
| WebSocket | ❌ No | — |
| Server-Sent Events (SSE) | ❌ No | — |
| Conexiones persistentes | ❌ No | — |
| Durable Objects | ❌ No | — |

**Detalle:** La app es 100% request-response REST. No hay conexiones de larga duración. Esto simplifica muchísimo el deploy a Workers. Si en el futuro se necesitan notificaciones en tiempo real, Workers soporta WebSockets (con el modelo `WebSocketPair`) y Durable Objects para estado persistente de conexiones.

---

## 8. Middlewares de Hono usados

| Middleware | Workers-compatible |
|---|---|
| `hono/cors` | 🟢 Sí |
| `hono/logger` | 🟢 Sí |
| `hono/factory` (`createMiddleware`) | 🟢 Sí |
| `@hono/zod-validator` (`zValidator`) | 🟢 Sí |
| `authMiddleware` (custom, usa `supabaseAdmin.auth.getUser()`) | 🟢 Sí (HTTP call) |

**Detalle:** Todos los middlewares usados son parte del ecosistema Hono estándar, diseñado para ser edge-compatible desde su concepción. El middleware de auth propio (`src/middleware/auth.ts`) solo hace llamadas HTTP a Supabase Auth y queries a la DB, sin dependencias de Node.

---

## 9. `tsconfig.json`

| Campo | Valor actual | Valor recomendado para Workers |
|---|---|---|
| `target` | `ES2022` | ✅ OK |
| `module` | `NodeNext` | 🔴 Cambiar a `ESNext` |
| `moduleResolution` | `NodeNext` | 🔴 Cambiar a `bundler` |
| `types` | (no especificado) | 🟡 Agregar `@cloudflare/workers-types` |

**Detalle:** Workers usa el bundler de `wrangler` (esbuild) que espera módulos ESM estándar, no el sistema de resolución de Node.js.

---

## Resumen tipo semáforo

### 🔴 Incompatible, requiere cambios (3 ítems)

| # | Problema | Solución |
|---|---|---|
| 1 | `serve()` + `@hono/node-server` | Eliminar `serve()`, exportar `export default app` con `app.fetch` |
| 2 | `process.env.*` + `dotenv` (7+3 ocurrencias) | Migrar a `c.env` + bindings de Workers (`wrangler.toml` / secrets) |
| 3 | `tsconfig.json` (`NodeNext` module) | Cambiar a `ESNext` module + `bundler` resolution |

### 🟡 Compatible con cambios menores (4 ítems)

| # | Problema | Solución |
|---|---|---|
| 4 | `Buffer.from()` en upload de fotos | Eliminar paso redundante; pasar `File` directo (como hace avatar) |
| 5 | `@hono/node-server` en `package.json` | Eliminar del bundle de Workers (mantener opcional para dev local) |
| 6 | `dotenv` en `package.json` | Eliminar del bundle de Workers |
| 7 | `@types/node` → `@cloudflare/workers-types` | Cambiar tipos globales para Workers |

### 🟢 Compatible tal cual

| # | Ítem |
|---|---|
| ✅ | `@supabase/supabase-js` — HTTP puro, edge-compatible |
| ✅ | `hono`, `hono/cors`, `hono/logger`, `hono/factory`, `@hono/zod-validator` |
| ✅ | `zod` — validación pura en JS |
| ✅ | `jszip`, `fast-xml-parser` — usados solo en scripts auxiliares, no en runtime |
| ✅ | Web Crypto API (`crypto.randomUUID()`) — nativo en Workers |
| ✅ | Sin WebSockets, SSE, ni conexiones de larga duración |
| ✅ | Sin `fs`, `path`, `child_process`, `net`, `tls` en código runtime |
| ✅ | Sin drivers TCP de base de datos |
| ✅ | Sin bindings nativos (`.node`) |
| ✅ | Uploads manejados en memoria (stream → Supabase Storage directamente) |
| ✅ | Middleware de auth usa solo HTTP calls |
| ✅ | Sin `__dirname` / `__filename` en código runtime |

---

## Recomendación final

> **Conviene Cloudflare Workers.** 🟢

**Fundamento:**

La app es prácticamente un candidate ideal para Workers:
- Arquitectura **100% stateless** (REST puro, sin WebSockets, sin filesystem)
- Base de datos PostgreSQL vía **Supabase HTTP API** (no TCP directo)
- Storage de archivos delegado a **Supabase Storage** (no disco local)
- Framework **Hono** diseñado para edge runtimes desde día 0
- Sin bindings nativos ni dependencias de C/C++

El trabajo de migración se reduce a **~3 cambios estructurales** (entry point, env vars, tsconfig) y **~4 cambios menores** (Buffer, dependencias, tipos). Es un trabajo de **1-2 horas máximo**.

### Comparativa rápida

| | Cloudflare Workers | VPS (Railway / Hetzner / Fly) |
|---|---|---|
| **Trabajo de migración** | Bajo (~1-2h) | Cero (ya funciona en Node) |
| **Costo mensual estimado** | $0 (free tier: 100k req/día) | $5-20/mes |
| **Latencia global** | Excelente (edge, ~300 ciudades) | Depende de la región del VPS |
| **Escalado** | Automático, serverless | Manual o auto-scaling configurable |
| **Cold starts** | <5ms (V8 isolates) | N/A (siempre caliente) |
| **Limitaciones** | 10ms CPU/request (free), 30s timeout | Sin límites de CPU/tiempo |
| **Supabase HTTP** | ✅ Nativo | ✅ Nativo |
| **Procesamiento pesado** | ❌ (10-30ms CPU budget) | ✅ Ilimitado |

**Veredicto:** La app de PetConnect no hace procesamiento pesado (no resizea imágenes, no hace IA inference, no parsea archivos grandes en el request path), así que el CPU budget de Workers no es un problema. **Workers Free Tier es más que suficiente para la escala actual**, y si el tráfico crece, los planes pagos de Workers siguen siendo más baratos que un VPS siempre-encendido.

Si más adelante se necesita procesamiento asíncrono pesado (ej: resize de imágenes al subir, generación de thumbnails), eso se puede mover a **Cloudflare Queues** + un consumer en Workers, o delegarse a Supabase Storage transformations / Edge Functions de Supabase.

### Plan de migración sugerido

1. Crear archivo `wrangler.toml` con bindings de entorno
2. Refactorizar `src/lib/supabase.ts` → factory function que recibe `env`
3. Refactorizar `src/index.ts` → eliminar `serve()`, exportar `export default app`
4. Reemplazar `process.env.*` por `c.env.*` en todas las rutas
5. Unificar upload de fotos de mascotas con el patrón de avatar (sin Buffer)
6. Actualizar `tsconfig.json` y `@types/cloudflare-workers`
7. Mover `@hono/node-server`, `dotenv` a `devDependencies` (o eliminarlos)
8. `wrangler dev` para test local → `wrangler deploy` para producción
