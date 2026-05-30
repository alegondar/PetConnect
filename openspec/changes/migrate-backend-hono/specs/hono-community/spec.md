## hono-community — Routers de mascotas perdidas y adopciones

### Endpoints — Lost Pets

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/lost-pets` | Sí | Listar mascotas perdidas (paginado, filtro: status) |
| POST | `/lost-pets` | Sí | Reportar mascota perdida |
| GET | `/lost-pets/{id}` | Sí | Detalle (con reporter) |
| PUT | `/lost-pets/{id}` | Sí | Actualizar reporte (solo reporter) |
| DELETE | `/lost-pets/{id}` | Sí | Eliminar reporte (solo reporter) |

### Endpoints — Adoptions

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/adoptions` | Sí | Listar adopciones (paginado, filtro: status) |
| POST | `/adoptions` | Sí | Publicar mascota en adopción |
| GET | `/adoptions/{id}` | Sí | Detalle (con pet, owner, adopter) |
| PUT | `/adoptions/{id}` | Sí | Actualizar publicación |
| DELETE | `/adoptions/{id}` | Sí | Eliminar publicación |

### Zod Schemas

- `CreateLostPetRequest`: `{ name, species, breed?, photo_url?, last_seen_lat, last_seen_lng, last_seen_address?, description? }`
- `UpdateLostPetRequest`: todos opcionales + `status: enum ['lost','found']`
- `LostPetDetail`: extiende LostPet con `reporter: Profile`
- `CreateAdoptionRequest`: `{ pet_id: uuid, description? }`
- `UpdateAdoptionRequest`: `{ status?: enum, adopter_id?: uuid, description? }`
- `AdoptionDetail`: extiende Adoption con `pet, owner, adopter`

### Comportamiento

- **Lost pets**: `reporter_id` = userId del contexto
- **Adoptions**: `owner_id` = userId, verificar que `pet_id` pertenece al usuario
- **Status enum lost-pets**: `['lost', 'found']`
- **Status enum adoptions**: `['available', 'pending', 'adopted']`
- **GET lost-pets/{id}**: join con `profiles` para obtener `reporter`
- **GET adoptions/{id}**: join con `pets`, `profiles` (owner), y `profiles` (adopter si existe)
- **DELETE/PUT**: verificar ownership (403 si no es el creador)
