## Why

PetConnect no tiene red social entre usuarios. No se pueden seguir perfiles, ver publicaciones de otros dueños, ni filtrar el feed por seguidos. El modelo actual es un feed global sin personalización. Agregar seguimiento entre usuarios, perfiles públicos, feed personalizado, notificaciones y búsqueda transforma la app en una verdadera red social de mascotas.

## What Changes

- Nueva tabla `user_follows` con triggers de contadores y notificaciones en Supabase
- Nuevo router `users.ts` con 8 endpoints: perfil público, posts de usuario, seguidores/seguidos, follow/unfollow, feed personalizado, búsqueda
- Modificar `GET /feed` para aceptar `?mode=following` (feed solo de seguidos)
- Nuevo endpoint `GET /notifications` y `PATCH /notifications/read`
- Nueva página `UserProfilePage.tsx` en `/profile/:userId`: avatar, bio, contadores, grid de posts, botón seguir
- Nuevo componente `FollowButton.tsx` con estados seguir/siguiendo/hover unfollow
- Nuevos modales `FollowersModal.tsx` y `FollowingModal.tsx`
- Nueva página `SearchUsersPage.tsx` en `/search` con debounce
- Modificar `PostCard.tsx`: avatar y username clickeables → navegan a `/profile/:id`
- Modificar `FeedPage.tsx`: toggle "Para vos" / "Siguiendo"
- Modificar `Layout.tsx`: íconos de búsqueda (lupa) y campanita con badge
- Componente `NotificationsDropdown.tsx` con badge de no leídas
- Actualizar `docs/openapi.yaml` con nuevos endpoints

## Capabilities

### New Capabilities

- `user-follows-db`: Tabla `user_follows`, triggers de contadores en profiles, trigger de notificación
- `users-api`: Router completo de usuarios (perfil, posts, seguidores/seguidos, follow/unfollow, feed personalizado, búsqueda)
- `notifications-api`: Endpoints GET y PATCH para notificaciones
- `user-profile-page`: Página de perfil público con avatar, bio, contadores, grid de posts, botón seguir
- `follow-button`: Componente reutilizable con estados seguir/siguiendo/hover
- `followers-modals`: Modales de listas de seguidores y seguidos con FollowButton
- `search-users`: Página de búsqueda de usuarios con debounce
- `notifications-ui`: Dropdown de campanita con badge y lista de notificaciones

### Modified Capabilities

- `feed-api`: GET /feed acepta nuevo query param `?mode=following`
- `feed-ui`: FeedPage gana toggle "Para vos" / "Siguiendo"
- `post-card`: Avatar y username del autor se vuelven clickeables (Link a perfil)
- `layout-ui`: Layout gana íconos de búsqueda y campanita en el header

## Impact

- `backend-node/src/routes/users.ts` — Nuevo router (8 endpoints)
- `backend-node/src/routes/feed.ts` — Modificar GET /feed
- `backend-node/src/routes/notifications.ts` — Nuevo router (2 endpoints)
- `backend-node/src/schemas/users.ts` — Nuevos schemas Zod
- `backend-node/src/index.ts` — Registrar nuevos routers
- `frontend/src/pages/UserProfilePage.tsx` — Nueva página
- `frontend/src/pages/SearchUsersPage.tsx` — Nueva página
- `frontend/src/components/FollowButton.tsx` — Nuevo componente
- `frontend/src/components/FollowersModal.tsx` — Nuevo modal
- `frontend/src/components/FollowingModal.tsx` — Nuevo modal
- `frontend/src/components/NotificationsDropdown.tsx` — Nuevo componente
- `frontend/src/components/PostCard.tsx` — Links a perfil
- `frontend/src/pages/FeedPage.tsx` — Toggle de feed
- `frontend/src/components/Layout.tsx` — Íconos lupa y campanita
- `frontend/src/App.tsx` — Nuevas rutas
- `frontend/src/api/endpoints/index.ts` — Nuevas funciones API
- `docs/db_schema_user_follows.sql` — SQL de migración
- `docs/openapi.yaml` — Documentar nuevos endpoints
