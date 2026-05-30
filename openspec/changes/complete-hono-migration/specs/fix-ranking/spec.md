## fix-ranking — Usar tabla weekly_ranking

### Problema

Hono calcula ranking desde `likes` con agrupación manual, pero FastAPI consulta directamente la tabla `weekly_ranking` que es mantenida por la DB (posiblemente una vista materializada o un cron job).

### Fix

```typescript
rankingRoutes.get("/ranking", async (c) => {
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);
  const { data, error } = await supabaseAdmin
    .from("weekly_ranking")
    .select("*")
    .order("rank")
    .limit(limit);

  if (error) return c.json({ detail: error.message }, 400);

  return c.json({
    items: data ?? [],
    updated_at: data?.[0]?.updated_at ?? null,
  });
});
```

### Verificación

- `GET /api/v1/ranking` debe devolver el mismo resultado que FastAPI
- Los campos deben coincidir: `rank`, `pet_id`, `pet_name`, `pet_photo_url`, `owner_username`, `likes_this_week`, `updated_at`
