## hono-ranking — Endpoint de ranking semanal

### Endpoint

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/ranking` | No (opcional) | Ranking semanal de mascotas |

### Query params

- `limit`: integer, default 20, max 100

### Response

```json
{
  "items": [
    {
      "rank": 1,
      "pet_id": "uuid",
      "pet_name": "Luna",
      "pet_photo_url": "https://...",
      "owner_username": "petlover",
      "likes_this_week": 142,
      "updated_at": "2026-05-30T00:00:00Z"
    }
  ],
  "updated_at": "2026-05-30T00:00:00Z"
}
```

### Comportamiento

- Si existe vista materializada `weekly_ranking`, consultarla directamente
- Si no, calcular desde `likes` donde `created_at` >= inicio de semana actual
- Agrupar por `pet_id`, contar likes, ordenar DESC, limitar
- Hacer join con `pets` y `profiles` para nombre/foto/username
- Agregar `rank` numérico secuencial (1-based)

### Zod Schemas

- `RankingEntry`: `{ rank, pet_id, pet_name, pet_photo_url, owner_username, likes_this_week, updated_at }`
