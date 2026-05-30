## Why

La migración inicial de FastAPI a Hono (`migrate-backend-hono`) tiene bugs críticos y omisiones que rompen funcionalidad del frontend. La auditoría exhaustiva comparando cada router, servicio y middleware de FastAPI contra la implementación Hono reveló:

- **Bug crítico**: El middleware de auth usa `auth.user.id` (UUID de Supabase Auth) pero toda la DB usa `profiles.id` (UUID autogenerado distinto). Esto hace que los checks de ownership fallen y los registros nuevos se guarden con IDs incompatibles con los existentes.
- **Endpoint faltante**: `POST /pets/upload-photo` (ya agregado en sesión anterior pero sin verificar compatibilidad de auth)
- **Endpoint faltante**: `PUT /feed/{post_id}` (ya agregado, sin verificar)
- **Ranking roto**: FastAPI consulta la tabla `weekly_ranking`, Hono calcula desde `likes` manualmente
- **PetFriendly incompleto**: Faltan campos `fuente` y `verificado`, enum de categorías muy limitado
- **Delete comment demasiado permisivo**: FastAPI solo permite al autor, Hono permite también al autor del post

## What Changes

Correcciones en `backend-node/src/`:

- `middleware/auth.ts`: Fetch `profiles.id` después de validar JWT, usar ese ID para contexto
- `routes/ranking.ts`: Consultar tabla `weekly_ranking` en vez de calcular desde `likes`
- `routes/petfriendly.ts`: Agregar campo `fuente: "usuario"` al crear, soportar 7 categorías
- `routes/feed.ts`: Ajustar delete comment (solo autor), update post (validar campos no vacíos)
- `schemas/petfriendly.ts`: Agregar `fuente`, `verificado`, 7 categorías
- `routes/pets.ts`: Verificar compatibilidad de upload-photo con nuevo sistema de auth

## Impact

- `backend-node/src/middleware/auth.ts` — Cambio crítico en auth middleware
- `backend-node/src/routes/ranking.ts` — Cambio de implementación
- `backend-node/src/routes/petfriendly.ts` — Agregar fuente al crear
- `backend-node/src/schemas/petfriendly.ts` — Schema completo
- `backend-node/src/routes/feed.ts` — Ajustes delete comment + update post
- `backend-node/src/routes/pets.ts` — Verificar upload-photo
