# PetConnect

Plataforma para conectar dueños de mascotas con servicios veterinarios, cuidadores y otros dueños de mascotas.

## Tecnologías

- **Backend:** Hono 4.7, TypeScript 5.8, Node.js
- **Frontend:** React 18, Vite, TypeScript
- **Base de datos:** Supabase (PostgreSQL + Auth + Storage)
- **Gestor de paquetes:** pnpm

## Estructura

```
PetConnect/
├── backend-node/      # API REST con Hono + TypeScript (activo)
│   └── src/
│       ├── index.ts
│       ├── routes/
│       ├── middleware/
│       ├── schemas/
│       └── lib/
├── backend/           # DEPRECATED — FastAPI (Python), en desuso
├── frontend/          # Aplicación React + Vite
├── docs/              # Documentación
│   ├── openapi.yaml
│   └── db_schema.sql
├── openspec/          # Especificaciones y cambios
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

```
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_KEY=<service_role_key>
FRONTEND_ORIGIN=http://localhost:5173
PORT=8000
```

### Frontend

```bash
pnpm --filter frontend dev
```

El frontend corre en `http://localhost:5173` y usa un proxy de Vite para redirigir `/api` al backend en `:8000`.

### Nota sobre backend/

El directorio `backend/` contiene el código legacy en FastAPI (Python) y está en desuso. El backend activo es `backend-node/`.
