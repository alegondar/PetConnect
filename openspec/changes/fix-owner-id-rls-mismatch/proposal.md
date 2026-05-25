## Why

Los RLS policies de Supabase en las tablas `pets`, `posts`, `likes`, `comments`, `lost_pets`, `adoptions` y otras comparan directamente `auth.uid()` con columnas FK que referencian `profiles(id)`. Pero `profiles.id` es un UUID aleatorio (`gen_random_uuid()`) mientras que `auth.uid()` retorna `auth.users.id`. Estos dos valores **nunca** coinciden, por lo que todas las policies de INSERT/UPDATE/DELETE rechazan silenciosamente las operaciones. En producción con el service key del backend esto no se nota (el service key bypassea RLS), pero rompe cualquier acceso directo desde el frontend o cliente móvil futuro.

## What Changes

- Corregir **todas** las RLS policies en `docs/db_schema.sql` que comparan `auth.uid() = <columna_fk>` para que resuelvan a través de la tabla `profiles` usando un subquery con `profiles.user_id`
- Corregir `backend/app/routers/pets.py`: cambiar `create_pet` para usar `user["user_id"]` (auth.users.id) en lugar de `user["id"]` (profiles.id) como `owner_id`
- Modificar la FK `pets.owner_id references profiles(id)` → `pets.owner_id references profiles(user_id)` para que acepte el auth.users.id **BREAKING**
- Aplicar el mismo patrón a las demás tablas afectadas (`posts`, `likes`, `comments`, `lost_pets`, `adoptions`, `instapet_posts`, `instapet_followers`)

## Capabilities

### New Capabilities

- `rls-owner-id-fix`: Corrección de RLS policies para que `auth.uid()` coincida correctamente con el dueño del registro a través de la tabla `profiles`

### Modified Capabilities

<!-- No existing specs to modify -->

## Impact

- `docs/db_schema.sql` — reescritura de ~25 RLS policies en 8+ tablas afectadas
- `backend/app/routers/pets.py` — `create_pet` cambia de `user["id"]` a `user["user_id"]`
- `backend/app/services/pet_service.py` — `verify_pet_owner` y similares deben comparar contra `owner_id` = `user["user_id"]` (consistente con el nuevo valor almacenado)
- **BREAKING**: Cambio de FK en `pets.owner_id` (y columnas similares) requiere migración de datos existentes
