## hono-core — Entry point, Supabase client, auth middleware, paginación

### Supabase Client (`src/lib/supabase.ts`)

- Debe exportar `supabase` (cliente con anon key) y `supabaseAdmin` (cliente con service role key)
- Variables de entorno: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`
- Crear cliente con `createClient(url, key, { auth: { persistSession: false } })`

### Auth Middleware (`src/middleware/auth.ts`)

- Extraer token del header `Authorization: Bearer <token>`
- Validar con `supabase.auth.getUser(token)`
- Si es inválido o ausente, retornar 401 `{ detail: "No autenticado" }`
- Si es válido, inyectar `userId` en el contexto de Hono (`c.set("userId", user.id)`)
- Middleware Hono estándar: `const authMiddleware = createMiddleware(async (c, next) => { ... })`

### Pagination Helper (`src/lib/pagination.ts`)

- Función `paginate<T>(query, page, limit): Promise<PaginatedResponse<T>>`
- Usar `.range(from, to)` de Supabase con `{ count: 'exact' }`
- Devolver `{ items: T[], total: number, page: number, pages: number }`

### Entry Point (`src/index.ts`)

- Crear app Hono con `new Hono()`
- Configurar CORS para `FRONTEND_ORIGIN` con `allowMethods: ['GET','POST','PUT','DELETE','OPTIONS']`
- Montar todos los routers bajo `/api/v1`
- Escuchar en `PORT` (default 8000)
- Logger simple de Hono (`hono/logger` opcional)

### Common Schemas (`src/schemas/common.ts`)

- `ErrorResponse`: `z.object({ detail: z.string() })`
- `PaginatedResponse`: genérico `z.object({ items: z.array(z.any()), total: z.number(), page: z.number(), pages: z.number() })`
