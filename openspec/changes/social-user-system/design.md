## Context

PetConnect tiene backend Hono en `backend-node/` y frontend React + Tailwind. El middleware de auth (`backend-node/src/middleware/auth.ts`) ya valida JWT y expone `userId` (profiles.id). El cliente Supabase admin (`supabaseAdmin`) permite operaciones con service role, bypassando RLS si se usa `WITH CHECK (true)`.

Actualmente no existe relación social entre usuarios. El feed (`GET /feed`) lista todos los posts globalmente. No hay perfiles públicos, ni follow/unfollow, ni feed personalizado, ni notificaciones push.

## Goals / Non-Goals

**Goals:**
- Tabla `user_follows` para relaciones entre usuarios con triggers de contadores en `profiles`
- CRUD de follow/unfollow con endpoints REST
- Perfil público de usuario (`/profile/:userId`) con avatar, bio, contadores y grid de posts
- Feed personalizado: toggle "Para vos" (global) / "Siguiendo" (solo seguidos)
- Búsqueda de usuarios por username o full_name con debounce
- Notificaciones básicas (nuevo seguidor, like, comentario) con badge y dropdown
- Avatar/username en PostCard clickeables → navegan a perfil

**Non-Goals:**
- Chat / mensajería directa entre usuarios
- Feed algorítmico (solo cronológico)
- Notificaciones push (solo in-app)
- Bloquear usuarios
- Posts privados / cuentas privadas

## Decisions

### 1. Contadores desnormalizados en profiles con triggers SQL

**Decisión**: Agregar `followers_count` y `following_count` a `profiles`, mantenidos por triggers `AFTER INSERT OR DELETE` en `user_follows`.

**Alternativa considerada**: Calcular con `COUNT(*)` en cada request. Rechazado por performance — cada vista de perfil haría 2 queries extra. Con millones de usuarios el costo escala mal.

### 2. Feed personalizado como extensión de GET /feed con ?mode=following

**Decisión**: Modificar `GET /feed` para aceptar `?mode=following`. Si el modo es "following", el backend filtra `WHERE author_id IN (SELECT following_id FROM user_follows WHERE follower_id = $userId)`. Si no hay token, devuelve 401. Sin mode, comportamiento actual.

**Alternativa considerada**: Nuevo endpoint `/users/me/feed`. Rechazado — duplica lógica de feed (paginación, joins con likes/comments). Mejor extender el existente.

### 3. Auth opcional en endpoints de perfil público

**Decisión**: `GET /users/:userId`, `GET /users/:userId/followers`, `GET /users/:userId/following`, `GET /users` aceptan token opcional. Si hay token, calculan `is_following` para cada perfil devuelto. Si no hay token, `is_following: false`.

**Alternativa considerada**: Siempre requerir auth. Rechazado — los perfiles públicos deberían ser visibles sin login (compartir links, SEO futuro).

### 4. is_following calculado en el backend

**Decisión**: Cada endpoint que devuelve perfiles hace un `LEFT JOIN` o subquery para determinar si el usuario autenticado sigue a cada perfil. Esto evita N+1 queries desde el frontend.

### 5. Notificaciones vía trigger SQL + polling en frontend

**Decisión**: Un trigger `AFTER INSERT` en `user_follows` inserta en tabla `notifications`. Para likes y comentarios, el trigger `new_follower` es el primero; likes/comments se agregan después. El frontend hace polling ligero o refresca al abrir el dropdown.

**Alternativa considerada**: Supabase Realtime. Rechazado por complejidad inicial — requiere WebSocket setup. El polling es suficiente para MVP.

### 6. Búsqueda de usuarios con ILIKE en backend

**Decisión**: `GET /users?q=texto` hace `WHERE username ILIKE '%texto%' OR full_name ILIKE '%texto%'`. Sin índice especial (ILIKE no usa índices btree estándar). Para MVP con cientos de usuarios es aceptable.

**Alternativa considerada**: Full-text search con `tsvector`. Rechazado por over-engineering para la escala actual.

## Risks / Trade-offs

- **[Riesgo] Trigger de contadores fuera de sync**: Si alguien modifica `user_follows` directo sin pasar por el trigger (ej: migración manual). → Mitigación: el trigger es AFTER INSERT OR DELETE. Si se necesita sync manual, correr `UPDATE profiles SET followers_count = (SELECT COUNT(*) FROM user_follows WHERE following_id = profiles.id)`.
- **[Riesgo] RLS en user_follows**: Si la RLS bloquea INSERT/DELETE, el backend con service role podría fallar si la política no usa `WITH CHECK (true)`. → Mitigación: todas las políticas usan `WITH CHECK (true)` como en otras tablas.
- **[Riesgo] Notificaciones sin limpieza**: La tabla `notifications` crece indefinidamente. → Mitigación: a futuro agregar TTL o soft-delete. Por ahora el volumen es bajo (<1000 notificaciones por usuario activo).
- **[Trade-off] Columna notifications sin FK a profiles**: La tabla `notifications` usa `user_id` sin FK explícita (para mantener compatibilidad con trigger). → Si se borra un usuario, sus notificaciones quedan huérfanas. Aceptable para MVP.
