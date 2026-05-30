## Root Cause: Auth Middleware ID Mismatch

```
FastAPI (get_current_user)               Hono (authMiddleware)
──────────────────────────               ─────────────────────
auth_user = supabase.auth.getUser(token)  auth_user = supabaseAdmin.auth.getUser(token)
                                          
profile = DB.profiles                     c.set("userId", auth_user.id)
  .eq("user_id", auth_user.id)             ↑ UUID_A (auth user UUID)
  .single()
                                          
return profile  → user["id"] = profile.id 
                 ↑ UUID_P (profile UUID, diferente de UUID_A)
```

**Consecuencia**: `pets.owner_id`, `posts.author_id`, `lost_pets.reporter_id`, etc. almacenan `profiles.id` (UUID_P). Con Hono, al insertar con `c.get("userId")` que es UUID_A, los registros nuevos son inaccesibles vía RLS y los checks de ownership fallan.

## Fix: Auth Middleware

```typescript
// auth.ts — corregido
export const authMiddleware = createMiddleware<{ Variables: Variables }>(
  async (c, next) => {
    const token = ...; // extraer Bearer token
    const { data } = await supabaseAdmin.auth.getUser(token);
    if (!data.user) return 401;

    // Obtener el profile.id (UUID_P), no auth.user.id (UUID_A)
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("user_id", data.user.id)
      .single();

    if (!profile) return c.json({ detail: "Usuario no encontrado" }, 401);

    // Este ID es compatible con todos los campos owner_id/author_id/etc de la DB
    c.set("userId", profile.id);
    await next();
  }
);
```

## Fix: Ranking

FastAPI consulta `weekly_ranking` (vista materializada o tabla mantenida por trigger). Hono debe hacer lo mismo:

```typescript
rankingRoutes.get("/ranking", async (c) => {
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);
  const { data, error } = await supabaseAdmin
    .from("weekly_ranking")
    .select("*")
    .order("rank")
    .limit(limit);
  // ...
});
```

## Fix: PetFriendly Schema

El schema de Hono tiene 7 categorías pero FastAPI usa solo 4. La DB usa 4 categorías también. Igualar a 4 categorías + agregar `fuente` y `verificado`:

```typescript
export const categoriaEnum = z.enum([
  "cafeteria", "bar_restaurante", "hotel", "experiencia",
]);
```

Al crear, agregar `fuente: "usuario"` como hace FastAPI:

```typescript
await supabaseAdmin.from("pet_friendly_places").insert({
  ...data,
  created_by: userId,
  fuente: "usuario",
});
```

## Fix: Delete Comment

FastAPI solo permite al autor del comentario eliminarlo. Hono también permitía al autor del post — eliminar esa permisividad extra.

## Fix: Update Post

FastAPI retorna 400 si no hay campos para actualizar. Hono debe hacer lo mismo.
