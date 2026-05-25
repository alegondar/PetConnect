## Why

PetConnect necesita su schema de base de datos PostgreSQL en `docs/db_schema.sql` para que los agentes openapi-agent, backend-agent y frontend-agent puedan trabajar sobre una fuente de verdad común. Sin schema no hay contratos ni implementación posible.

## What Changes

- Crear `docs/db_schema.sql` con DDL completo para PostgreSQL + Supabase
- Cubrir los 7 features v1: auth, feed, ranking, mascotas, perdidas, adopción, InstaPet
- Incluir extensiones, índices, triggers `updated_at` y políticas RLS

## Capabilities

### New Capabilities
- `db-schema-auth`: Tabla `profiles` vinculada a `auth.users` de Supabase con datos de usuario (username, avatar, bio)
- `db-schema-pets`: Tablas `pets`, `vet_visits` y `pet_events` con relaciones y constraints
- `db-schema-social`: Tablas `posts`, `likes`, `comments` y vista `weekly_ranking` para el feed y ranking
- `db-schema-community`: Tablas `lost_pets` (con lat/lng) y `adoptions` con estados

## Impact

- Nuevo archivo `docs/db_schema.sql`
- Define las entidades base para todo el desarrollo backend y frontend
- Sin impacto en código existente (solo nuevo archivo)
