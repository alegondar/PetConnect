## 1. Scaffolding: copiar proyecto y configurar dependencias

- [x] 1.1 Copiar `backend-node/` a `backend-worker/` excluyendo `node_modules/`, `.env`, y `dist/`
- [x] 1.2 Instalar dependencias base con `pnpm install` dentro de `backend-worker/`
- [x] 1.3 Agregar devDependencies: `wrangler`, `@cloudflare/workers-types`
- [x] 1.4 Remover dependencias Node-only: `@hono/node-server`, `dotenv`
- [x] 1.5 Crear `backend-worker/wrangler.toml` con name, main, compatibility_date, compatibility_flags, y `[vars]` (solo valores no secretos)

## 2. Entry point: refactorizar src/index.ts para Workers

- [x] 2.1 Eliminar `import "dotenv/config"` y `import { serve } from "@hono/node-server"`
- [x] 2.2 Definir tipo `Bindings` con las 4 variables de entorno (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `FRONTEND_ORIGIN`)
- [x] 2.3 Tipar la app Hono con `{ Bindings: Bindings; Variables: { userId: string } }`
- [x] 2.4 Reemplazar `process.env.FRONTEND_ORIGIN` y `process.env.PORT` por `c.env.FRONTEND_ORIGIN` (PORT se elimina, no aplica en Workers)
- [x] 2.5 Eliminar el bloque `serve({ fetch: app.fetch, port: PORT }, ...)` y su callback de log
- [x] 2.6 Agregar `export default app` al final del archivo

## 3. Supabase client: refactorizar a factory function

- [x] 3.1 Reemplazar el módulo singleton en `src/lib/supabase.ts` por una función `getSupabaseClients(env)` que reciba credenciales como parámetro
- [x] 3.2 Eliminar `import "dotenv/config"` y todas las referencias a `process.env`
- [x] 3.3 Exportar la función como named export (no export default)

## 4. Rutas: migrar a getSupabaseClients(c.env)

- [x] 4.1 Actualizar `src/middleware/auth.ts`: reemplazar `import { supabaseAdmin } from "../lib/supabase.js"` por llamada a `getSupabaseClients(c.env)` dentro del middleware
- [x] 4.2 Actualizar `src/routes/auth.ts`: migrar import del cliente supabase y reemplazar `process.env.SUPABASE_URL` por `c.env.SUPABASE_URL` en el endpoint de avatar
- [x] 4.3 Actualizar `src/routes/pets.ts`: migrar import del cliente supabase, reemplazar `process.env.SUPABASE_URL` por `c.env.SUPABASE_URL`
- [x] 4.4 Actualizar `src/routes/feed.ts`: migrar import del cliente supabase
- [x] 4.5 Actualizar `src/routes/ranking.ts`: migrar import del cliente supabase
- [x] 4.6 Actualizar `src/routes/community.ts`: migrar import del cliente supabase
- [x] 4.7 Actualizar `src/routes/instapet.ts`: migrar import del cliente supabase
- [x] 4.8 Actualizar `src/routes/petfriendly.ts`: migrar import del cliente supabase
- [x] 4.9 Actualizar `src/routes/notifications.ts`: migrar import del cliente supabase
- [x] 4.10 Actualizar `src/routes/services.ts`: migrar import del cliente supabase
- [x] 4.11 Actualizar `src/routes/veterinarias.ts`: migrar import del cliente supabase
- [x] 4.12 Actualizar `src/routes/users.ts`: migrar import del cliente supabase

## 5. Upload de archivos: eliminar Buffer de Node.js

- [x] 5.1 En `src/routes/pets.ts`, endpoint `POST /pets/upload-photo`: eliminar `file.arrayBuffer()` y `Buffer.from(buffer)`, pasar `file` directamente a `storage.from("pets").upload(path, file)`
- [x] 5.2 Verificar que el endpoint `POST /auth/avatar` en `src/routes/auth.ts` ya usa el patrón correcto (pasa `File` directo, sin Buffer) — sin cambios necesarios

## 6. TypeScript y configuración

- [x] 6.1 Actualizar `backend-worker/tsconfig.json`: cambiar `module` de `NodeNext` a `ESNext`, `moduleResolution` de `NodeNext` a `bundler`
- [x] 6.2 Agregar `"types": ["@cloudflare/workers-types"]` al `compilerOptions` de `tsconfig.json`

## 7. Verificación y documentación

- [x] 7.1 Verificar que `backend-node/` no fue modificado: correr `git diff --stat backend-node/` (debe mostrar 0 cambios)
- [x] 7.2 Crear `backend-worker/README-DEPLOY.md` con instrucciones: `wrangler login`, `wrangler secret put`, `wrangler dev`, `wrangler deploy`
- [x] 7.3 Correr `tsc --noEmit` en `backend-worker/` y verificar que no haya errores de tipos
- [x] 7.4 Correr `wrangler dev` y verificar que `GET http://localhost:8787/` responde `{"message": "PetConnect API is running"}`
