## ADDED Requirements

### Requirement: Worker entry point follows Cloudflare Workers convention
El worker SHALL exportar un objeto con propiedad `fetch` que use `app.fetch` de Hono, sin depender de `@hono/node-server` ni `serve()`.

#### Scenario: Worker handles HTTP request
- **WHEN** una request HTTP llega al worker
- **THEN** `app.fetch` procesa la request y retorna una respuesta HTTP

#### Scenario: Worker no usa Node.js server APIs
- **WHEN** se inspecciona el código fuente de `src/index.ts`
- **THEN** no hay imports de `@hono/node-server`, ni llamadas a `serve()`, `listen()`, o `http.createServer`

### Requirement: Variables de entorno via bindings de Workers
El worker SHALL acceder a las variables de entorno mediante `c.env` (Hono Bindings) en lugar de `process.env`. Las variables requeridas son `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, y `FRONTEND_ORIGIN`.

#### Scenario: Handler accede a variable de entorno
- **WHEN** un handler necesita la URL de Supabase
- **THEN** la obtiene de `c.env.SUPABASE_URL` sin usar `process.env`

#### Scenario: Configuración ausente en el código fuente
- **WHEN** se inspecciona el código fuente de `backend-worker/src/`
- **THEN** no existen imports de `dotenv` ni usos de `process.env`

### Requirement: Cliente Supabase via factory function
El worker SHALL crear los clientes de Supabase mediante una función `getSupabaseClients(env)` que recibe las credenciales como parámetro, en lugar de un módulo singleton que lee `process.env`.

#### Scenario: Creación de clientes tipada
- **WHEN** se llama a `getSupabaseClients(env)` con el objeto de bindings
- **THEN** retorna `{ supabase, supabaseAdmin }` con clientes configurados correctamente

#### Scenario: No hay side-effects de import
- **WHEN** se importa `src/lib/supabase.ts`
- **THEN** no se ejecutan lecturas de `process.env` ni se crean clientes automáticamente

### Requirement: Upload de fotos sin Buffer de Node.js
El worker SHALL manejar uploads de archivos pasando el objeto `File` del Web API directamente a `supabase.storage.upload()`, sin conversión intermedia a `Buffer`.

#### Scenario: Upload de foto de mascota
- **WHEN** un usuario envía un archivo via `multipart/form-data` a `POST /api/v1/pets/upload-photo`
- **THEN** el archivo se pasa directamente como `File` a `storage.from("pets").upload(path, file)`

#### Scenario: Código libre de Buffer
- **WHEN** se inspecciona `src/routes/pets.ts`
- **THEN** no existen referencias a `Buffer.from()` ni `buffer.arrayBuffer()`

### Requirement: Configuración de TypeScript para Workers
El `tsconfig.json` SHALL usar `module: "ESNext"`, `moduleResolution: "bundler"`, e incluir `@cloudflare/workers-types` en el array de `types`.

#### Scenario: Compilación sin errores
- **WHEN** se ejecuta `tsc --noEmit` en `backend-worker/`
- **THEN** no hay errores de tipos relacionados con APIs de Workers

### Requirement: Archivo wrangler.toml presente y configurado
El worker SHALL tener un archivo `wrangler.toml` con name, main, compatibility_date, compatibility_flags, y las variables no secretas en `[vars]`.

#### Scenario: wrangler.toml válido
- **WHEN** se ejecuta `wrangler dev` en `backend-worker/`
- **THEN** el worker inicia localmente sin errores de configuración

#### Scenario: Secrets no están en wrangler.toml
- **WHEN** se inspecciona `wrangler.toml`
- **THEN** `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_KEY` NO aparecen en `[vars]` (deben configurarse como secrets)
