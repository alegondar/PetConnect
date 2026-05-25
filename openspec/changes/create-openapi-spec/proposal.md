## Why

El backend y frontend de PetConnect necesitan un contrato de API firme como fuente de verdad compartida. Sin `docs/openapi.yaml` completo basado en el schema de base de datos, ambos equipos trabajan a ciegas y la integración es propensa a errores.

## What Changes

- Reemplazar `docs/openapi.yaml` placeholder con la especificación OpenAPI 3.0.3 completa
- Definir todos los endpoints RESTful basados en las 12 tablas de `docs/db_schema.sql`
- Incluir schemas de request/response, paginación, autenticación Bearer JWT y códigos de error

## Capabilities

### New Capabilities
- `api-auth`: Endpoints de autenticación (login, register, profile) usando Supabase Auth JWT
- `api-pets`: CRUD de mascotas, visitas al veterinario y eventos de health tracking
- `api-instapet`: Endpoints sociales de InstaPet (posts por mascota, seguidores, milestones)
- `api-social`: CRUD de posts, likes y comentarios con contadores automáticos
- `api-ranking`: Endpoint de ranking semanal basado en la vista materializada `weekly_ranking`
- `api-community`: CRUD de mascotas perdidas (con geolocalización) y adopciones
- `api-instapet`: Posts, seguidores y milestones del perfil social de cada mascota

## Impact

- Modifica `docs/openapi.yaml` (reemplaza el placeholder por especificación completa)
- Define ~36 endpoints RESTful
- Establece el contrato que backend-agent y frontend-agent usarán en paralelo
