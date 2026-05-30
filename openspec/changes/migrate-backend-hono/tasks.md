## 1. Scaffolding y configuración base

- [x] 1.1 Crear `backend-node/package.json` con dependencias (hono, @hono/zod-validator, zod, @supabase/supabase-js, tsx, typescript, @types/node)
- [x] 1.2 Crear `backend-node/tsconfig.json` (target ES2022, module NodeNext, strict)
- [x] 1.3 Crear `backend-node/.env.example` con las 5 variables requeridas
- [x] 1.4 Instalar dependencias con `pnpm install`

## 2. Core: Supabase client, auth middleware, paginación

- [x] 2.1 Crear `src/lib/supabase.ts` — cliente singleton con anon key + service role
- [x] 2.2 Crear `src/middleware/auth.ts` — middleware que extrae Bearer token y llama `supabase.auth.getUser(token)`
- [x] 2.3 Crear `src/index.ts` — entry point: app Hono con CORS, prefix `/api/v1`, registrar todos los routers
- [x] 2.4 Crear helper de paginación genérico en `src/lib/pagination.ts`
- [x] 2.5 Crear `src/schemas/common.ts` — ErrorResponse, PaginatedResponse genérico

## 3. Schemas Zod por módulo

- [x] 3.1 Crear `src/schemas/auth.ts` — RegisterRequest, LoginRequest, UpdateProfileRequest, Profile, AuthResponse
- [x] 3.2 Crear `src/schemas/pets.ts` — Pet, CreatePet, UpdatePet, VetVisit, CreateVetVisit, PetEvent, CreatePetEvent, y Paginated wrappers
- [x] 3.3 Crear `src/schemas/feed.ts` — Post, PostDetail, CreatePost, Comment, CreateComment, Like, y Paginated wrappers
- [x] 3.4 Crear `src/schemas/ranking.ts` — RankingEntry
- [x] 3.5 Crear `src/schemas/community.ts` — LostPet, LostPetDetail, CreateLostPet, UpdateLostPet, Adoption, AdoptionDetail, CreateAdoption, UpdateAdoption, y Paginated wrappers
- [x] 3.6 Crear `src/schemas/instapet.ts` — InstaPetPost, InstaPetPostDetail, CreateInstaPetPost, InstaPetFollower, FollowingPet, InstaPetMilestone, CreateMilestone, y Paginated wrappers
- [x] 3.7 Crear `src/schemas/petfriendly.ts` — PetFriendlyPlace, CreatePetFriendlyPlace, y Paginated wrapper

## 4. Routers

- [x] 4.1 Crear `src/routes/auth.ts` — POST /auth/register, POST /auth/login, GET /auth/me, PUT /auth/me
- [x] 4.2 Crear `src/routes/pets.ts` — CRUD /pets, /pets/{pet_id}/vet-visits, /pets/{pet_id}/events (11 endpoints)
- [x] 4.3 Crear `src/routes/feed.ts` — CRUD /feed, /feed/{post_id}/like, /feed/{post_id}/comments (7 endpoints)
- [x] 4.4 Crear `src/routes/ranking.ts` — GET /ranking (1 endpoint)
- [x] 4.5 Crear `src/routes/community.ts` — CRUD /lost-pets + /adoptions (8 endpoints)
- [x] 4.6 Crear `src/routes/instapet.ts` — CRUD /instapet/posts, followers, milestones (8 endpoints)
- [x] 4.7 Crear `src/routes/petfriendly.ts` — GET|POST /pet-friendly (2 endpoints)

## 5. Integración y verificación

- [x] 5.1 Verificar que `npx tsx src/index.ts` levanta en puerto 8000 sin errores
- [x] 5.2 Verificar que `GET http://localhost:8000/api/v1/pets` responde correctamente
- [x] 5.3 Verificar auth flow: register → login → usar token en endpoint protegido
- [x] 5.4 Correr el frontend contra `backend-node/` y verificar que todas las páginas cargan
- [x] 5.5 Agregar script `"dev": "tsx watch src/index.ts"` a package.json
