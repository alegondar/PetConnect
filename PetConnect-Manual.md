# Manual de Desarrollo — PetConnect (Manada Libre)

> Documentación completa del proceso de creación del proyecto, incluyendo comandos, prompts y configuraciones.

---

## Índice

1. [Descripción del Proyecto](#1-descripción-del-proyecto)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Prerequisitos](#3-prerequisitos)
4. [Inicialización del Proyecto](#4-inicialización-del-proyecto)
5. [Configuración de OpenSpec](#5-configuración-de-openspec)
6. [Creación de Agentes](#6-creación-de-agentes)
7. [Base de Datos — Supabase](#7-base-de-datos--supabase)
8. [OpenAPI Spec](#8-openapi-spec)
9. [Backend — FastAPI](#9-backend--fastapi)
10. [Frontend — React](#10-frontend--react)
11. [Conexión con Supabase](#11-conexión-con-supabase)
12. [Ejecución del Proyecto](#12-ejecución-del-proyecto)
13. [Flujo de Orquestación OpenSpec](#13-flujo-de-orquestación-openspec)
14. [Errores Comunes y Soluciones](#14-errores-comunes-y-soluciones)
15. [Notas Importantes](#15-notas-importantes)

---

## 1. Descripción del Proyecto

**PetConnect** (nombre final: **Manada Libre**) es una aplicación de mascotas con versión web y Android que incluye:

- Feed de mascotas estilo Instagram
- Ranking semanal (top mascotas por puntos)
- Mis mascotas + visitas al veterinario
- Mascotas perdidas (con ubicación lat/lng)
- Adopción
- Login/Auth con JWT
- **InstaPet**: red social por mascota (posts, seguidores, hitos de vida)

> El nombre interno del proyecto es `PetConnect`. El nombre visible al usuario se cambia al final sin modificar código interno.

---

## 2. Stack Tecnológico

### Backend
- **FastAPI** + Python 3.11+
- **Supabase** (PostgreSQL + Auth + Storage)
- `supabase-py`, `pydantic v2`, `python-jose`, `uvicorn`, `python-dotenv`
- Deploy futuro: Railway

### Frontend Web
- **React 18** + Vite + TypeScript
- **Tailwind CSS v3** + shadcn/ui
- React Query v5, Zustand, React Router v6
- Axios, react-hook-form + zod
- Deploy futuro: Vercel

### Android (futuro)
- Jetpack Compose, MVVM, Hilt, Retrofit, Coil

### Herramientas de orquestación
- **OpenCode** (AI coding agent)
- **OpenSpec** (spec-driven development)

---

## 3. Prerequisitos

```bash
# Node.js y pnpm
node --version   # >= 18
pnpm --version

# Python
python3 --version  # >= 3.11

# Git
git --version

# OpenCode
opencode --version
```

---

## 4. Inicialización del Proyecto

```bash
# Crear carpeta del proyecto
mkdir PetConnect
cd PetConnect

# Inicializar git
git init

# Inicializar OpenSpec
openspec init
# Seleccionar: OpenCode

# Ver estructura creada
ls openspec/
# changes/  config.yaml  specs/
```

---

## 5. Configuración de OpenSpec

Editar `openspec/config.yaml` con todo el contexto del proyecto:

```yaml
schema: spec-driven

context: |
  Proyecto: PetConnect - App de mascotas con versión web y Android
  
  Stack backend:
    - FastAPI + Python 3.11+
    - Supabase (PostgreSQL + Auth + Storage)
    - supabase-py, pydantic v2, python-jose, uvicorn
    - Deploy: Railway
  
  Stack frontend web:
    - React 18 + Vite + TypeScript
    - Tailwind CSS v3 + shadcn/ui
    - React Query v5, Zustand, React Router v6
    - Axios, react-hook-form + zod
    - Deploy: Vercel
  
  Stack Android (futuro):
    - Jetpack Compose, MVVM, Hilt, Retrofit, Coil
  
  Estructura del monorepo:
    - backend/   → FastAPI
    - frontend/  → React + Vite
    - docs/      → openapi.yaml, db_schema.sql
  
  Features v1:
    - Login/Auth (JWT con Supabase Auth)
    - Feed de mascotas (posts, likes, comentarios)
    - Ranking semanal (top mascotas por puntos)
    - Mis mascotas + visitas al veterinario
    - Mascotas perdidas (con lat/lng)
    - Adopción
    - InstaPet (red social por mascota: posts, seguidores, hitos)
  
  Paleta de colores:
    - Primary: #D946EF (pink/magenta)
    - Secondary: #F0ABFC
    - Accent: #F59E0B (amber, ranking)
    - Background: #F9FAFB
    - Text: #111827
  
  Convenciones:
    - UUID como PK en todas las tablas
    - Timestamps created_at y updated_at en todas las tablas
    - Endpoints paginados con ?page=1&limit=20
    - Errores con HTTPException consistente en backend
    - Commits en español con conventional commits
    - Ramas: main, dev, feature/nombre-feature

rules:
  proposal:
    - Siempre incluir motivación y objetivo claro
    - Listar los archivos que se van a crear o modificar
    - Máximo 300 palabras
  design:
    - Justificar decisiones técnicas
    - Incluir alternativas consideradas
  tasks:
    - Cada tarea debe ser completable en menos de 2 horas
    - Agrupar tareas por módulo (backend, frontend, docs)
    - Indicar dependencias entre tareas
  specs:
    - Basarse siempre en docs/openapi.yaml como fuente de verdad
    - Incluir ejemplos de request y response
```

> **IMPORTANTE:** Configurar el `config.yaml` ANTES de crear los agentes y ANTES de correr cualquier propose. Es el paso que se debe hacer primero.

---

## 6. Creación de Agentes

### Prompt para crear la estructura base del monorepo

```
/opsx:propose "Crear el monorepo base de PetConnect con la estructura de carpetas completa: backend/ (FastAPI), frontend/ (React + Vite), docs/ (openapi.yaml vacío), y README.md con descripción del proyecto"
```

```bash
/opsx:apply
```

### Prompt para crear los agentes

```
/opsx:propose "Crear los siguientes agentes en .opencode/agents/ para el proyecto PetConnect:

- orchestrator.md: agente principal que coordina y delega tareas al resto de agentes en orden
- db-agent.md: diseña el schema PostgreSQL para Supabase (docs/db_schema.sql)
- openapi-agent.md: genera docs/openapi.yaml completo basándose en db_schema.sql
- backend-agent.md: implementa FastAPI basándose en openapi.yaml
- frontend-agent.md: implementa React + Vite + Tailwind basándose en openapi.yaml
- designer.md: define paleta de colores, componentes UI y estilo visual mobile-first
- tester.md: genera tests para backend (pytest) y frontend (vitest)
- reviewer.md: revisa código, detecta errores y sugiere mejoras
- documenter.md: genera documentación técnica y CHECKLIST.md

Cada agente debe incluir: descripción, responsabilidades, inputs, outputs y orden en el flujo de orquestación"
```

```bash
/opsx:apply
```

### Flujo de orquestación de agentes

```
designer (1) → db-agent (2) → openapi-agent (3) → backend (4) || frontend (4) → tester (5) → reviewer (6) → documenter (7)
```

---

## 7. Base de Datos — Supabase

### Prompt para el agente DB

```
/opsx:propose "Invocar db-agent: crear docs/db_schema.sql con el schema completo de PostgreSQL para Supabase incluyendo tablas: users, pets, posts, post_likes, comments, weekly_ranking, vet_visits, instapet, lost_pets, adoptions. Con UUID como PK, timestamps, foreign keys con ON DELETE CASCADE, políticas RLS y índices en owner_id, pet_id y created_at"
```

```bash
/opsx:apply
```

### Tablas generadas (12 tablas)

| Feature | Tabla(s) |
|---|---|
| Auth | profiles |
| Feed | posts, likes, comments |
| Ranking | weekly_ranking (materialized view) |
| Mis mascotas | pets, vet_visits |
| InstaPet | instapet_posts, instapet_followers, instapet_milestones |
| Perdidas | lost_pets |
| Adopción | adoptions |
| Health tracking | pet_events |

### Configurar Supabase

1. Crear cuenta en [supabase.com](https://supabase.com) con GitHub
2. Crear nuevo proyecto
3. Región: **South America (São Paulo)**
4. Ir al **SQL Editor**: `https://supabase.com/dashboard/project/[PROJECT_ID]/sql/new`
5. Pegar el contenido de `docs/db_schema.sql` y hacer **Run**
6. Verificar tablas en **Table Editor**

---

## 8. OpenAPI Spec

### Prompt para el agente OpenAPI

```
/opsx:propose "Invocar openapi-agent: crear docs/openapi.yaml completo basándose en docs/db_schema.sql según las instrucciones del agente .opencode/agents/openapi-agent.md. Incluir endpoints de InstaPet social: instapet_posts, instapet_followers, instapet_milestones"
```

```bash
/opsx:apply
```

### Resultado

- 1767 líneas
- 25 endpoints
- 47 operaciones
- 34 schemas
- JWT Bearer auth global

### Endpoints por módulo

| Tag | Rutas | Descripción |
|---|---|---|
| Auth | 3 | Register, login, profile |
| Pets | 5 | CRUD mascotas |
| VetVisits | 3 | Visitas al veterinario |
| PetEvents | 3 | Health tracking |
| Feed | 8 | Posts, likes, comments |
| Ranking | 1 | Ranking semanal |
| LostPets | 4 | Mascotas perdidas |
| Adoptions | 4 | Adopciones |
| InstaPet | 8 | Posts, followers, milestones |

---

## 9. Backend — FastAPI

### Prompt para el agente Backend

```
/opsx:propose "Invocar backend-agent: implementar la API completa con FastAPI basándose en docs/openapi.yaml según las instrucciones del agente .opencode/agents/backend-agent.md"
```

```bash
/opsx:apply
```

### Estructura generada

```
backend/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── core/
│   │   ├── auth.py
│   │   ├── pagination.py
│   │   └── supabase.py
│   ├── routers/
│   │   ├── auth.py
│   │   ├── pets.py
│   │   ├── social.py
│   │   ├── ranking.py
│   │   ├── community.py
│   │   └── instapet.py
│   ├── schemas/
│   └── services/
├── requirements.txt
└── .env.example
```

### Instalar dependencias

```bash
cd backend
pip install -r requirements.txt --break-system-packages
```

### Configurar variables de entorno

Crear `backend/.env`:

```env
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_KEY=eyJ...anon-key
SUPABASE_SERVICE_KEY=eyJ...service-role-key
SECRET_KEY=petconnect-secret-key-2026
FRONTEND_ORIGIN=http://localhost:5173
```

> **Dónde encontrar las keys:** Supabase Dashboard → Settings → API Keys → **Legacy anon, service_role API keys**  
> Usar las keys en formato `eyJ...`, NO las `sb_publishable_...`

### Fix: cargar variables de entorno

El `app/config.py` necesita `python-dotenv`. Editar manualmente si el agente no lo incluyó:

```python
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "http://localhost:54321")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
JWT_SECRET = os.getenv("JWT_SECRET", SUPABASE_SERVICE_KEY)
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
```

### Levantar el backend

```bash
cd backend
uvicorn app.main:app --reload
```

Ver documentación en: `http://localhost:8000/docs`

---

## 10. Frontend — React

### Prompt para el agente Frontend

```
/opsx:propose "Invocar frontend-agent: implementar la app web completa con React + Vite + Tailwind basándose en docs/openapi.yaml según las instrucciones del agente .opencode/agents/frontend-agent.md"
```

```bash
/opsx:apply
```

### Instalar dependencias

```bash
cd frontend
pnpm install
```

### Levantar el frontend

```bash
pnpm dev
```

Ver la app en: `http://localhost:5173`

### Estructura generada

```
frontend/src/
├── api/
│   ├── client.ts        (Axios + JWT interceptor)
│   └── endpoints/       (auth, pets, feed, ranking, instapet)
├── components/
│   ├── layout/          (Navbar, BottomNav, Layout)
│   └── shared/          (PostCard, PetCard, etc)
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── FeedPage.tsx
│   ├── MyPetsPage.tsx
│   ├── InstaPetPage.tsx
│   ├── RankingPage.tsx
│   ├── LostPetsPage.tsx
│   └── AdoptionsPage.tsx
├── store/               (Zustand: authStore)
├── hooks/
└── router/
```

---

## 11. Conexión con Supabase

### Desactivar confirmación de email (para desarrollo)

Supabase Dashboard → Authentication → Providers → Email → desactivar **"Confirm email"**

### Verificar que el backend conecta

```bash
# En la terminal del backend, al levantar debería verse:
# INFO: Application startup complete.
# INFO: 127.0.0.1 - "GET / HTTP/1.1" 200 OK
```

---

## 12. Ejecución del Proyecto

Para levantar el proyecto completo necesitás **dos terminales**:

### Terminal 1 — Backend

```bash
cd ~/Documentos/code-proyect/PetConnect/backend
uvicorn app.main:app --reload
# Corre en http://localhost:8000
# Docs en http://localhost:8000/docs
```

### Terminal 2 — Frontend

```bash
cd ~/Documentos/code-proyect/PetConnect/frontend
pnpm dev
# Corre en http://localhost:5173
```

### Para retomar el proyecto después de apagar la PC

```bash
cd ~/Documentos/code-proyect/PetConnect
opencode
```

No hace falta ningún comando especial — OpenCode lee los archivos automáticamente.

---

## 13. Flujo de Orquestación OpenSpec

### Comandos disponibles

| Comando | Descripción |
|---|---|
| `/opsx:propose "descripción"` | Planificar un cambio (no toca archivos) |
| `/opsx:apply` | Ejecutar el último propose |
| `/opsx:archive [change-name]` | Archivar un change completado |

### Cuándo usar `/opsx:propose`

- Cambios grandes (nuevo módulo, nueva feature, rediseño)
- Cuando querés ver qué va a cambiar ANTES de ejecutar
- Cuando querés poder revertir si algo sale mal

### Cuándo mandar mensaje directo (sin propose)

- Correcciones puntuales en 1-2 archivos
- Fixes de bugs simples
- Cambios de texto o estilos menores

### Revertir cambios con git

```bash
# Descartar todos los cambios no commiteados
git stash

# Ver historial de commits
git log --oneline

# Volver a un commit específico
git checkout [commit-hash] -- frontend/src/
```

### Regla importante para prompts a agentes de diseño

Siempre especificar qué NO tocar:

```
NO modificar: router/, stores/, api/, hooks/, tipos
SOLO modificar: clases Tailwind, index.css, tailwind.config.js
```

---

## 14. Errores Comunes y Soluciones

### `ModuleNotFoundError: No module named 'app'`

```bash
# Asegurate de estar en la carpeta backend
cd ~/Documentos/code-proyect/PetConnect/backend
uvicorn app.main:app --reload
```

### `ModuleNotFoundError: No module named 'backend'`

El agente generó imports incorrectos. Mandar en OpenCode:

```
El backend tiene imports incorrectos. Los archivos usan "from backend.app.xxx import" pero deberían usar "from app.xxx import". Corregí todos los imports en backend/app/ que empiecen con "backend.app."
```

### `SupabaseException: supabase_key is required`

El `.env` no se está cargando. Verificar que `app/config.py` tiene `load_dotenv()`.

### `SupabaseException: Invalid API key`

Estás usando la key `sb_publishable_...` que no es compatible con `supabase-py`. Usar la key legacy en formato `eyJ...` desde: Settings → API Keys → **Legacy anon, service_role API keys**.

### Error de lucide-react al compilar

```bash
cd frontend
pnpm add lucide-react
```

### Conflictos de dependencias con herramientas de Kali Linux

Son normales, no afectan al proyecto. El mensaje `Successfully installed...` al final confirma que todo instaló bien.

### RLS bloquea operaciones del backend (42501)

**Síntoma**: `postgrest.exceptions.APIError: new row violates row-level security policy`

**Causa**: supabase-py 2.7.1 no hace bypass del RLS aunque uses `SUPABASE_SERVICE_KEY`. PostgREST recibe la key como `apikey` pero no como rol `service_role`, así que el RLS se evalúa con rol `anon` y `auth.uid()` es NULL.

**Solución**: Modificar las políticas RLS de cada tabla para permitir inserts/updates/deletes con `WITH CHECK (true)`. El backend ya valida autenticación en `get_current_user()`.

```sql
-- Ejemplo para cualquier tabla nueva:
DROP POLICY IF EXISTS "nombre-politica" ON nombre_tabla;
CREATE POLICY "nombre-politica" ON nombre_tabla FOR INSERT WITH CHECK (true);
CREATE POLICY "nombre-politica" ON nombre_tabla FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "nombre-politica" ON nombre_tabla FOR DELETE USING (true);
```

**Tablas ya corregidas**: posts, comments, likes (25/05/2026)

### Storage: bucket no existe

**Síntoma**: Error 404 al subir archivos con `POST /pets/upload-photo`

**Solución**: Crear el bucket en Supabase (SQL Editor):
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('pets', 'pets', true, 10485760, '{image/jpeg,image/png,image/gif,image/webp}')
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Backend manages pets storage"
ON storage.objects FOR ALL
USING (bucket_id = 'pets')
WITH CHECK (bucket_id = 'pets');
```

---

## 15. Notas Importantes

### Cambio de nombre de la app

El nombre visible **Manada Libre** se cambia al final sin tocar código interno:

- `frontend/index.html` → cambiar `<title>`
- `frontend/package.json` → cambiar `name`
- Navbar y textos visibles al usuario

La base de datos, endpoints y estructura interna quedan igual.

### Migrar de Supabase a otro DB en el futuro

Si en el futuro querés salir de Supabase:

- **Frontend** → no cambia nada
- **FastAPI routers** → no cambia nada
- **FastAPI services** → no cambia nada
- **Cambios necesarios:**
  - Auth: reemplazar Supabase Auth por `fastapi-users`
  - DB: reemplazar `supabase-py` por `SQLAlchemy` + PostgreSQL
  - Storage: reemplazar Supabase Storage por carpeta local o S3
- **Recomendación:** PostgreSQL puro, NO SQLite para producción

### Plan gratuito de Supabase

- PostgreSQL: 500 MB
- Storage: 1 GB
- Auth: usuarios ilimitados
- El proyecto se pausa tras 7 días sin actividad (se reactiva con un click)

### Entorno virtual Python (recomendado para próximos proyectos)

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Para desactivar:
deactivate
```

### InstaPet — Arquitectura

InstaPet es una **red social interna por mascota**, no un registro de salud:

- Cada mascota tiene su propio **perfil con feed** de posts
- Otros usuarios pueden **seguir** mascotas
- Posts con fotos, likes y comentarios
- **Hitos de vida**: primer baño, primera vacuna, etc.
- Separado del Feed general (que muestra contenido de todas las mascotas)

### Diferencia entre Feed y InstaPet

| Feed (Home) | InstaPet |
|---|---|
| Posts de todas las mascotas del mundo | Perfil y posts de UNA mascota específica |
| Como el Explorar de Instagram | Como el perfil de Instagram de una mascota |
| Filtros: Mundo / Siguiendo | Feed personal de la mascota |

---

*Manual actualizado el 25/05/2026 — Proyecto PetConnect / Manada Libre*

---

## 16. Cambios recientes (25/05/2026)

### Fix: RLS bloqueaba operaciones del backend
- **Tablas corregidas en Supabase**: posts, comments, likes — políticas cambiadas a `WITH CHECK (true)`
- **Archivos modificados**: ninguno (solo SQL ejecutado directamente en Supabase)
- **Documentado en**: Sección 14, apartado "RLS bloquea operaciones del backend"

### Feature: Subida de fotos en posts
- **Backend**: Ya existía `POST /api/v1/pets/upload-photo` (sin cambios)
- **Supabase**: Creado bucket `pets` en Storage + política RLS
- **Frontend**: 
  - `src/api/endpoints/index.ts` → agregado `petsApi.uploadPhoto(file)`
  - `src/components/CreatePostModal.tsx` → input de archivo con preview, reemplaza el input de URL

### Feature: Editar y eliminar posts
- **Backend**:
  - `app/schemas/social.py` → nuevo `UpdatePostRequest`
  - `app/services/social_service.py` → nueva función `update_post()`
  - `app/routers/social.py` → nuevo `PUT /api/v1/feed/{post_id}`
- **Frontend**:
  - `src/api/endpoints/index.ts` → agregado `feedApi.update()`
  - `src/components/PostCard.tsx` → menú ⋯ con opciones ✏️ Editar y 🗑️ Eliminar + modal de edición

### Fix: Comentarios invisibles
- **Causa**: `CommentSection.tsx` usaba animación `fadeIn` que no existe en `index.css`
- **Fix**: Eliminada la animación del render de comentarios

### Feature: Editar y eliminar mascotas (Mis Pets)
- **Frontend**: `src/pages/MyPetsPage.tsx` → menú `⋯` con ✏️ Editar y 🗑️ Eliminar en cada card de mascota
- El `PetFormInline` ahora soporta crear y editar (recibe `pet` opcional para precargar datos)
- Usa `petsApi.update()` y `petsApi.delete()` (endpoints ya existentes en backend)

### Feature: Menú de opciones rediseñado
- **SVG de 3 círculos verticales** reemplaza el texto `···` (más profesional, escalable)
- **40px** (`w-10 h-10`), fondo `bg-primary/15` siempre visible, `hover:bg-primary/25`, `active:scale-95`, `shadow-sm`
- **Dropdown**: `rounded-2xl shadow-sm border border-gray-100` (especificación del diseñador)
- Aplicado en: `PostCard.tsx`, `MyPetsPage.tsx`

### Feature: Marquee banner
- **CSS**: `@keyframes marquee` en `index.css` — desliza texto de derecha a izquierda
- **Layout**: Banner fijo `bottom-14` con "🐾 vamos los perros dale rambo dale rambo 🐾" en loop
- Fondo `bg-primary/10`, texto primary, tipografía Fredoka
- El `main` tiene `pb-[130px]` para no solaparse con el marquee + nav

### Design: Patitas de fondo rediseñadas
- **Forma**: emoji 🐾 real (igual al logo), no círculos SVG
- **25 copias** distribuidas con `text-shadow` en 3 pseudo-elementos (`html::before`, `body::before`, `body::after`)
- **Tamaños**: 70px, 80px, 90px (visibles, transparentes)
- Contenido protegido con `relative z-[2]` en Layout
