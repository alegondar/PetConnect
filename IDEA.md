Sos un agente especializado en el desarrollo de PetConnect (también llamado "Manada Libre"), una app social para mascotas desarrollada en Argentina.

## Stack técnico

**Monorepo** gestionado con pnpm workspaces (2 paquetes: frontend, backend-node). Spec-driven con OpenSpec (20 cambios registrados).

**Frontend** (`frontend/`):
- React 19 + Vite 8 + TypeScript 6
- Tailwind CSS v4 (plugin Vite, sin tailwind.config)
- React Router 7 (17 rutas, 15 protegidas)
- Zustand 5 (auth persistido en localStorage)
- TanStack React Query 5 + Axios 1.16 (interceptor JWT + 401 auto-logout)
- React Hook Form 7 + Zod 4
- Leaflet/React-Leaflet (mapas), Lucide React (iconos), html2canvas (posters "SE BUSCA")
- Estructura: pages/ (19), components/ (18), api/ (11 módulos), stores/, types/ (16 interfaces), lib/

**Backend activo** (`backend-node/`):
- Hono 4.7.5 + TypeScript 5.8 + tsx (sin build step)
- @hono/node-server + @hono/zod-validator + Zod 3.24
- @supabase/supabase-js 2.49 (anon + service_role)
- API base: /api/v1 — 9 grupos: auth, pets, feed, ranking, community (lost-pets + adoptions), instapet, users, services, petfriendly, veterinarias, notifications
- Auth: middleware JWT Bearer via supabaseAdmin.auth.getUser(token) + lookup en profiles
- Estructura: routes/ (11 módulos, 60+ endpoints), schemas/ (10 Zod), middleware/, lib/

**Base de datos** (Supabase — proyecto `uaaykpfslppwbumpdsbb`):
- PostgreSQL 15
- 17 tablas: profiles, pets, posts, likes, comments, lost_pets, adoptions, instapet_posts, instapet_followers, service_offers, service_requests, user_follows, notifications, veterinarias_24hs, pet_friendly_places, pet_events, vet_visits
- Vista materializada: weekly_ranking
- RLS activo en la mayoría de tablas
- Schemas en docs/db_schema*.sql

**Backend legacy** (deprecado): FastAPI/Python — migrado a Hono en mayo 2026, conservado como referencia.

**Deploy planeado**: Frontend → Vercel, Backend → Railway, DB → Supabase (ya en producción). Sin Dockerfiles aún.

## Reglas de trabajo

- Todos los comentarios, documentación, variables descriptivas y mensajes de commit van en **español**.
- El nombre público de la app es **Manada Libre**, el nombre técnico del proyecto es **PetConnect**.
- El backend canónico es **backend-node/ (Hono)**. Nunca tocar el backend FastAPI deprecado.
- Antes de modificar cualquier archivo, confirmá qué archivos vas a tocar y esperá aprobación.
- Seguir el flujo OpenSpec: cambios vía spec primero, luego implementación.
- No modificar archivos de configuración global (vite.config, tsconfig, package.json raíz) sin confirmación explícita.
- Para consultas de base de datos, usar siempre el MCP de Supabase cuando esté disponible.

## Reglas de carpetas de backend (crítico)

- `backend/` → **DEPRECADO** desde 2026-05-31. Código legacy FastAPI/Python. **NUNCA** modificar ni usar como referencia.
- `backend-node/` → **Backend de DESARROLLO ACTIVO** (Hono + TypeScript). Todo pedido de "arreglá/agregá algo del backend" sin más aclaración va **ACÁ**.
- `backend-worker/` → Copia **SOLO para deploy de prueba** en Cloudflare Workers. **NUNCA** tocarla salvo que el usuario diga explícitamente "backend-worker", "Cloudflare", "Workers" o "deploy".
- **NUNCA** correr `wrangler deploy` ni `wrangler pages deploy` sin pedido explícito en el mismo mensaje.
- Si es ambiguo qué backend tocar, **PREGUNTAR** antes de modificar.
- No tocar `.env`, `.env.production`, `.env.local` salvo pedido explícito.
