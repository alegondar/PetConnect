## Why

Dos usuarios diferentes (`alegondar@gmail.com` y `alegondar1@gmail.com`) ven las mismas mascotas en "Mis Pets". El frontend llama `GET /api/v1/pets` sin filtrar por `owner_id`, y el backend devuelve TODAS las mascotas del sistema. No hay aislamiento de datos por usuario en la vista "Mis Pets".

## What Changes

- Nuevo endpoint `GET /api/v1/my-pets` autenticado que filtra automáticamente por `profiles.id` del usuario logueado
- Frontend: `MyPetsPage`, `CreatePostModal`, `AdoptionsPage`, `FeedPage` llaman al nuevo endpoint en vez de `GET /pets` genérico
- Limpieza de caché de React Query (`queryClient.clear()`) al hacer logout para evitar fuga de datos entre sesiones en la misma pestaña

## Capabilities

### New Capabilities

- `my-pets-endpoint`: Endpoint autenticado `GET /api/v1/my-pets` que devuelve solo las mascotas cuyo `owner_id` coincide con el `profiles.id` del token JWT

### Modified Capabilities

- `frontend-pets`: Los componentes que muestran "Mis Pets" deben usar el nuevo endpoint autenticado en vez del endpoint público genérico

## Impact

- **Backend**: Nuevo endpoint en `backend-node/src/routes/pets.ts` y `backend/app/routers/pets.py`
- **Frontend**: `MyPetsPage.tsx`, `CreatePostModal.tsx`, `AdoptionsPage.tsx`, `FeedPage.tsx`, `SettingsPage.tsx` (logout), `LoginPage.tsx` (cache clear)
- **Caché**: `queryClient.clear()` en logout/login para prevenir cross-user data leaks
- **Tipo**: Bug fix, no es breaking change
