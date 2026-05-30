## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     backend-node/                           │
├─────────────────────────────────────────────────────────────┤
│  src/                                                       │
│  ├── index.ts              ← Entry point (Hono app)         │
│  ├── routes/                                               │
│  │   ├── auth.ts           ← POST /auth/register, /login    │
│  │   │                        GET|PUT /auth/me              │
│  │   ├── pets.ts           ← CRUD /pets, /vet-visits,       │
│  │   │                        /events                       │
│  │   ├── feed.ts           ← CRUD /feed, likes, comments    │
│  │   ├── ranking.ts        ← GET /ranking                   │
│  │   ├── community.ts      ← CRUD /lost-pets, /adoptions    │
│  │   ├── instapet.ts       ← CRUD /instapet, /followers,    │
│  │   │                        /follow, /milestones          │
│  │   └── petfriendly.ts    ← GET|POST /pet-friendly         │
│  ├── schemas/                                              │
│  │   ├── auth.ts           ← RegisterRequest, LoginRequest, │
│  │   │                        UpdateProfile, Profile        │
│  │   ├── pets.ts           ← Pet, CreatePet, UpdatePet,     │
│  │   │                        VetVisit, PetEvent, etc.      │
│  │   ├── feed.ts           ← Post, CreatePost, Comment,     │
│  │   │                        CreateComment, Like           │
│  │   ├── ranking.ts        ← RankingEntry                   │
│  │   ├── community.ts      ← LostPet, Adoption, etc.        │
│  │   ├── instapet.ts       ← InstaPetPost, Follower,        │
│  │   │                        Milestone, etc.               │
│  │   ├── petfriendly.ts    ← PetFriendlyPlace, CreatePlace  │
│  │   └── common.ts         ← ErrorResponse, PaginatedResponse│
│  ├── lib/                                                  │
│  │   └── supabase.ts       ← Cliente Supabase (anon +       │
│  │                             service role)                │
│  └── middleware/                                           │
│      └── auth.ts           ← Middleware JWT (bearer token)  │
├── package.json                                             │
├── tsconfig.json                                            │
└── .env.example                                             │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

```
HTTP Request
    │
    ▼
┌─────────────┐    ┌─────────────────┐    ┌──────────────────┐
│  CORS       │───▶│  authMiddleware  │───▶│  Route Handler   │
│  middleware  │    │  (si requiere   │    │  (zod validation │
│              │    │   auth)         │    │   via @hono/     │
└─────────────┘    └─────────────────┘    │   zod-validator)  │
                                          └────────┬─────────┘
                                                   │
                                          ┌────────▼─────────┐
                                          │  Supabase Client  │
                                          │  (supabase-js)    │
                                          └──────────────────┘
```

## Tech Decisions

### Hono en lugar de Express
- Hono es más ligero, tiene mejor soporte TypeScript nativo, y su API de middleware es más limpia
- `@hono/zod-validator` integra validación directamente en la ruta sin boilerplate
- Soporte nativo de `c.json()`, `c.status()`, respuestas tipadas

### Supabase JS SDK
- `supabase.auth.getUser(token)` para validar JWT — no se necesita lógica manual de JWT
- `supabase.from("table").select()` para queries — misma API que el frontend
- Service role key para operaciones privilegiadas (register via admin API, inserts con RLS bypass)

### Zod en lugar de Pydantic
- Schemas declarativos con `.parse()` y `.safeParse()`
- `@hono/zod-validator` proporciona `zValidator('json', schema)` y `zValidator('param', schema)`
- Inferencia de tipos TypeScript con `z.infer<typeof schema>`

### Paginación
```typescript
// Helper genérico
async function paginate<T>(
  query: SupabaseQuery,
  page: number,
  limit: number
): Promise<PaginatedResponse<T>> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const { data, count } = await query.range(from, to);
  return {
    items: data,
    total: count ?? 0,
    page,
    pages: Math.ceil((count ?? 0) / limit),
  };
}
```

## CORS Configuration

Mismo origen que FastAPI: `FRONTEND_ORIGIN` (default `http://localhost:5173`):

```typescript
app.use('*', cors({
  origin: FRONTEND_ORIGIN,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
}));
```

## Environment Variables

```bash
SUPABASE_URL=https://uaaykpfslppwbumpdsbb.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_KEY=eyJhbGciOi...
FRONTEND_ORIGIN=http://localhost:5173
PORT=8000
```

Mismas variables que `backend/.env`, pero nombres alineados con el SDK JS (`SUPABASE_ANON_KEY` en lugar de `SUPABASE_KEY`).

## File Mapping: FastAPI → Hono

| FastAPI | Hono |
|---------|------|
| `backend/app/main.py` | `src/index.ts` |
| `backend/app/config.py` | variables de entorno directas |
| `backend/app/core/supabase.py` | `src/lib/supabase.ts` |
| `backend/app/core/auth.py` | `src/middleware/auth.ts` |
| `backend/app/core/pagination.py` | helper inline en `src/index.ts` |
| `backend/app/schemas/*.py` | `src/schemas/*.ts` |
| `backend/app/services/*.py` | lógica inline en routers (Hono permite mantenerlo simple) |
| `backend/app/routers/*.py` | `src/routes/*.ts` |
