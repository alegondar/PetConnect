## fix-auth-middleware — Corregir ID en auth middleware

### Problema

El middleware actual `c.set("userId", data.user.id)` usa `auth.users.id` pero toda la DB usa `profiles.id` para campos como `owner_id`, `author_id`, `reporter_id`, `follower_id`. Estos UUIDs son diferentes porque `profiles.id` es `gen_random_uuid()`.

### Fix

Después de validar el JWT con `supabaseAdmin.auth.getUser(token)`, consultar `profiles` para obtener el `profiles.id` correspondiente:

```typescript
const { data: profile } = await supabaseAdmin
  .from("profiles")
  .select("id")
  .eq("user_id", data.user.id)
  .single();

if (!profile) return c.json({ detail: "Usuario no encontrado" }, 401);

c.set("userId", profile.id);
```

### Verificación

- Crear una mascota con el nuevo auth → `owner_id` debe ser `profiles.id`
- Verificar que mascotas creadas por FastAPI sigan siendo accesibles (ownership check pasa)
- Verificar que crear post, like, follow, etc. almacena `profiles.id` correctamente
