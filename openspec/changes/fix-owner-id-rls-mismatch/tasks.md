## 1. Corregir RLS policies en `pets`

- [x] 1.1 Reemplazar `auth.uid() = owner_id` en las policies INSERT/UPDATE/DELETE de `pets` por subquery con `profiles`
- [x] 1.2 Verificar que la policy SELECT (`using (true)`) no necesita cambios

## 2. Corregir RLS policies en tablas dependientes directas

- [x] 2.1 Corregir `posts`: RLS INSERT/UPDATE/DELETE — reemplazar `auth.uid() = author_id`
- [x] 2.2 Corregir `likes`: RLS INSERT/DELETE — reemplazar `auth.uid() = user_id`
- [x] 2.3 Corregir `comments`: RLS INSERT/UPDATE/DELETE — reemplazar `auth.uid() = user_id`
- [x] 2.4 Corregir `lost_pets`: RLS INSERT/UPDATE/DELETE — reemplazar `auth.uid() = reporter_id`
- [x] 2.5 Corregir `adoptions`: RLS INSERT/UPDATE/DELETE — reemplazar `auth.uid() = owner_id`

## 3. Corregir RLS policies en tablas InstaPet

- [x] 3.1 Corregir `instapet_posts`: RLS INSERT/UPDATE/DELETE — reemplazar `auth.uid() = author_id`
- [x] 3.2 Corregir `instapet_followers`: RLS INSERT/DELETE — reemplazar `auth.uid() = follower_id`

## 4. Corregir RLS en tablas con subquery anidado

- [x] 4.1 Corregir `vet_visits`: RLS policies que verifican `pets.owner_id = auth.uid()` → subquery a través de `profiles`
- [x] 4.2 Corregir `pet_events`: RLS policies que verifican `pets.owner_id = auth.uid()` → subquery a través de `profiles`
- [x] 4.3 Corregir `instapet_milestones`: RLS policies que verifican indirectamente → subquery a través de `profiles`

## 5. Backend — Verificación y documentación

- [x] 5.1 Confirmar que `get_current_user` retorna `profiles.id` y `profiles.user_id` (ambos disponibles)
- [x] 5.2 Confirmar que `create_pet` usa `user["id"]` (= `profiles.id`) que es correcto para la FK `references profiles(id)`
- [x] 5.3 Confirmar que `verify_pet_owner` compara `owner_id` con `user["id"]` (correcto)
- [x] 5.4 Actualizar `docs/db_schema.sql` con todas las policies corregidas
