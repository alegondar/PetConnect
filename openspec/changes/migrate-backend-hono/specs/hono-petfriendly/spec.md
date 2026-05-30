## hono-petfriendly — Endpoint de lugares pet-friendly

### Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/pet-friendly` | No | Listar lugares pet-friendly (paginado, filtro: categoria) |
| POST | `/pet-friendly` | Sí | Agregar nuevo lugar pet-friendly |

### Query params (GET)

- `page`: integer, default 1
- `limit`: integer, default 20
- `categoria`: string opcional, filtra por categoría

### Zod Schemas

- `PetFriendlyPlace`: `{ id, nombre, categoria, direccion, lat, lng, descripcion?, foto_url?, created_by?, created_at }`
- `CreatePetFriendlyPlaceRequest`: `{ nombre, categoria, direccion, lat, lng, descripcion?, foto_url? }`
- `categoria` enum: `['cafeteria', 'bar_restaurante', 'hotel', 'experiencia', 'veterinaria', 'pet_shop', 'otro']`

### Comportamiento

- **GET**: Query `pet_friendly_places` table, filtro `categoria` opcional, orden alfabético
- **POST**: Insertar con `created_by = userId` del contexto auth
- Las coordenadas se almacenan como `lat`/`lng` (PostGIS no necesario por ahora)

### Nota

Este endpoint refleja el trabajo del change `pet-friendly-places` (currently in-progress). La tabla `pet_friendly_places` debe existir en Supabase — si se migra antes de que ese change esté completo, el endpoint devolverá array vacío hasta que la tabla esté creada.
