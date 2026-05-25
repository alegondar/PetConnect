## Context

El schema de PetConnect usa `profiles` como tabla intermedia entre `auth.users` (Supabase Auth) y las tablas de negocio. Las FK de todas las tablas referencian `profiles(id)` (un UUID aleatorio), pero las RLS policies comparan `auth.uid()` (que retorna `auth.users.id`) directamente contra esas columnas FK. Como `profiles.id` ≠ `auth.users.id`, las policies siempre fallan.

El backend usa el service key de Supabase, que bypassea RLS, por lo que el bug no se manifiesta en desarrollo. Pero cualquier acceso directo desde el frontend (usando la anon key) o desde un cliente móvil futuro será bloqueado por RLS.

## Goals / Non-Goals

**Goals:**
- Corregir TODAS las RLS policies para que `auth.uid()` coincida correctamente a través de la tabla `profiles`
- Mantener las FK existentes (sin migración de datos)
- Mantener el backend consistente: `owner_id` = `profiles.id` (valor que satisface la FK)

**Non-Goals:**
- No cambiar las FK existentes (`references profiles(id)`)
- No migrar datos existentes
- No modificar la estructura de `profiles`

## Decisions

**1. RLS: usar subquery en vez de `auth.uid() = columna` directo**

Decisión: Reemplazar `auth.uid() = owner_id` por:
```sql
exists (
  select 1 from profiles
  where profiles.id = owner_id
  and profiles.user_id = auth.uid()
)
```

Alternativa A: Cambiar el backend para almacenar `auth.users.id` en lugar de `profiles.id`, y cambiar las FK a `references auth.users(id)`.  
Razón del rechazo: Requiere migración de datos. Supabase restringe FK directas a `auth.users` en algunos contextos. Además, rompe el patrón de tener `profiles` como tabla de dominio.

Alternativa B: Hacer que `profiles.id = auth.users.id` (eliminar `gen_random_uuid()`, usar `user_id` como PK).  
Razón del rechazo: Rompe compatibilidad con datos existentes. Requiere migración de todos los registros y todas las FK.

**2. Backend: mantener `user["id"]` como `owner_id`**

Decisión: NO cambiar `create_pet` — seguir usando `user["id"]` (profiles.id) porque coincide con la FK `references profiles(id)`.

Alternativa: Usar `user["user_id"]` (auth.users.id).  
Razón del rechazo: No pasaría la FK constraint `owner_id references profiles(id)` porque `auth.users.id` no existe en `profiles.id`.

**3. Tablas dependientes: subquery anidado**

Para tablas como `vet_visits` y `pet_events` que verifican ownership a través de `pets.owner_id`:

```sql
-- Antes (roto):
pets.owner_id = auth.uid()

-- Después (corregido):
exists (
  select 1 from profiles
  where profiles.id = pets.owner_id
  and profiles.user_id = auth.uid()
)
```

## Risks / Trade-offs

- **[Riesgo]** El subquery `exists (select 1 from profiles ...)` agrega un join en cada operación RLS → **Mitigación**: `profiles` es una tabla pequeña (un registro por usuario). El índice en `profiles.id` (PK) y `profiles.user_id` (unique) hace que el subquery sea O(1).
- **[Trade-off]** El backend no cambia (sigue usando `profiles.id`) → Aceptado: la FK se mantiene y la verificación de ownership en el backend (vía `verify_pet_owner`) compara `owner_id` con `user["id"]`, que ya es correcto.
