# PetConnect

Plataforma para conectar dueños de mascotas con servicios veterinarios, cuidadores y otros dueños de mascotas.

## Tecnologías

- **Backend:** Hono 4.7, TypeScript 5.8, Node.js
- **Frontend:** React 19, Vite, Tailwind CSS 4, TypeScript
- **Base de datos:** Supabase (PostgreSQL + Auth + Storage)
- **Gestor de paquetes:** pnpm

## Funcionalidades

| Módulo | Descripción |
|---|---|
| 🔐 **Auth** | Registro, login, recuperación de contraseña, configuración de perfil |
| 🐾 **Feed** | Posts de mascotas con likes, comentarios y fotos |
| 🏆 **Ranking** | Top mascotas semanal por likes |
| 🐶 **Mis Pets** | CRUD de mascotas, visitas al veterinario, eventos (InstaPet) |
| 🔍 **Perdidos** | Reporte y búsqueda de mascotas perdidas con mapa Leaflet |
| 🏠 **Adopciones** | Publicación y gestión de mascotas en adopción |
| 📍 **PetFriendly** | Directorio de 357+ lugares pet-friendly en Buenos Aires con mapa |
| 🏥 **Veterinarias 24hs** | Mapa de veterinarias 24hs de CABA y GBA importadas desde KMZ |
| 👤 **Perfil** | Avatar, username, bio, cambio de email/contraseña, eliminación de cuenta |
| 🔔 **Notificaciones** | Toggles placeholder (próximamente) |

## Estructura

```
PetConnect/
├── backend-node/      # API REST con Hono + TypeScript (activo)
│   └── src/
│       ├── index.ts
│       ├── routes/    # auth, pets, feed, ranking, community, instapet, petfriendly
│       ├── middleware/ # auth (JWT via Supabase)
│       ├── schemas/   # Zod schemas
│       └── lib/       # supabase client (service role + anon)
├── backend/           # DEPRECATED — FastAPI (Python), en desuso
├── frontend/          # Aplicación React + Vite
│   └── src/
│       ├── pages/     # 15 páginas (login, feed, settings, pet-friendly, etc.)
│       ├── components/# Layout, PostCard, AvatarUpload, CreatePostModal, etc.
│       ├── api/       # Cliente axios + endpoints
│       ├── stores/    # Zustand (authStore)
│       ├── lib/       # Cliente Supabase frontend
│       └── types/     # Interfaces TypeScript
├── docs/              # Documentación
│   ├── openapi.yaml
│   ├── db_schema.sql
│   └── db_schema_petfriendly.sql
├── openspec/          # Especificaciones y cambios
│   ├── changes/       # Cambios activos/completados
│   └── specs/         # Especificaciones de capacidades
├── pnpm-workspace.yaml
└── README.md
```

## Requisitos

- Node.js 18 o superior
- pnpm (`npm install -g pnpm` o `corepack enable`)

## Setup

### Instalación

```bash
pnpm install
```

### Backend (Hono)

```bash
pnpm --filter petconnect-backend dev
```

El servidor corre en `http://localhost:8000`. Las rutas de la API están bajo `/api/v1`.

Variables de entorno necesarias en `backend-node/.env`:

```env
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_KEY=<service_role_key>
FRONTEND_ORIGIN=http://localhost:5173
PORT=8000
```

### Frontend

```bash
pnpm --filter frontend dev
```

El frontend corre en `http://localhost:5173` y usa un proxy de Vite para redirigir `/api` al backend en `:8000`.

Variables de entorno en `frontend/.env`:

```env
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon_key>
```

### Supabase — Configuración inicial

Ejecutar en el **SQL Editor** de Supabase:

```sql
-- Bucket de avatares
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Avatars are publicly readable" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars');

-- Columna full_name en profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
```

## API — Endpoints principales

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/v1/auth/register` | No | Registro de usuario |
| POST | `/api/v1/auth/login` | No | Inicio de sesión |
| GET | `/api/v1/auth/me` | Sí | Perfil completo (incluye email) |
| PUT | `/api/v1/auth/me` | Sí | Actualizar perfil (username, full_name, bio, avatar_url) |
| PUT | `/api/v1/auth/password` | Sí | Cambiar contraseña |
| PUT | `/api/v1/auth/email` | Sí | Cambiar email |
| POST | `/api/v1/auth/avatar` | Sí | Subir foto de perfil (multipart) |
| DELETE | `/api/v1/auth/me` | Sí | Eliminar cuenta permanentemente |
| GET | `/api/v1/feed` | Sí | Feed de posts paginado |
| POST | `/api/v1/feed` | Sí | Crear post |
| POST | `/api/v1/feed/:id/like` | Sí | Dar like |
| GET | `/api/v1/ranking` | Sí | Ranking semanal |
| GET | `/api/v1/pets` | Sí | Listar mascotas |
| POST | `/api/v1/pets` | Sí | Registrar mascota |
| GET | `/api/v1/lost-pets` | Sí | Mascotas perdidas |
| GET | `/api/v1/pet-friendly` | Sí | Lugares pet-friendly (paginado, filtro por categoría) |
| GET | `/api/v1/adoptions` | Sí | Adopciones |

### Nota sobre backend/

El directorio `backend/` contiene el código legacy en FastAPI (Python) y está en desuso. El backend activo es `backend-node/`.

## Agentes OpenSpec

El proyecto usa OpenSpec para gestionar cambios. Agentes disponibles:

| Agente | Función |
|---|---|
| `orchestrator` | Coordina y delega tareas al resto de agentes |
| `db-agent` | Diseña schema PostgreSQL para Supabase |
| `openapi-agent` | Genera docs/openapi.yaml |
| `backend-agent` | Implementa backend FastAPI (legacy) |
| `frontend-agent` | Implementa frontend React |
| `designer` | Define paleta de colores, tipografía, componentes UI |
| `documenter` | Genera documentación técnica y CHECKLIST |
| `tester` | Tests para backend (pytest) y frontend (vitest) |
| `reviewer` | Revisa código, detecta errores, sugiere mejoras |

**Flujo de trabajo:**
1. `/opsx-propose <nombre>` — Crear propuesta de cambio
2. `/opsx-apply` — Implementar tareas
3. `/opsx-archive` — Archivar cambio completado
