## hono-pets — Routers de mascotas, visitas veterinarias y health tracking

### Endpoints — Pets

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/pets` | Sí | Listar mascotas (paginado, filtros: species, owner_id) |
| POST | `/pets` | Sí | Registrar nueva mascota |
| GET | `/pets/{pet_id}` | Sí | Obtener mascota por ID |
| PUT | `/pets/{pet_id}` | Sí | Actualizar mascota (solo owner) |
| DELETE | `/pets/{pet_id}` | Sí | Eliminar mascota (solo owner) |

### Endpoints — Vet Visits

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/pets/{pet_id}/vet-visits` | Sí | Listar visitas (paginado) |
| POST | `/pets/{pet_id}/vet-visits` | Sí | Registrar visita |
| PUT | `/pets/{pet_id}/vet-visits/{visit_id}` | Sí | Actualizar visita |
| DELETE | `/pets/{pet_id}/vet-visits/{visit_id}` | Sí | Eliminar visita |

### Endpoints — Pet Events (Health Tracking)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/pets/{pet_id}/events` | Sí | Listar eventos (paginado) |
| POST | `/pets/{pet_id}/events` | Sí | Registrar evento |
| PUT | `/pets/{pet_id}/events/{event_id}` | Sí | Actualizar evento |
| DELETE | `/pets/{pet_id}/events/{event_id}` | Sí | Eliminar evento |

### Zod Schemas

- `CreatePetRequest`: `{ name: z.string(), species: z.string(), breed?: string, age?: number, weight?: number, photo_url?: string, bio?: string }`
- `UpdatePetRequest`: todos los campos opcionales
- `CreateVetVisitRequest`: `{ vet_name: string, visit_date: string, reason: string, notes?: string }`
- `CreatePetEventRequest`: `{ event_type: enum, event_date: string, value?: string, notes?: string }`

### Comportamiento

- **GET /pets**: Query `pets` table con filtros opcionales, orden por `created_at DESC`
- **POST /pets**: Insertar con `owner_id = userId` del contexto
- **PUT/DELETE /pets/{pet_id}**: Verificar que `owner_id === userId` (403 si no)
- **Vet visits y events**: Verificar que el `pet_id` existe y pertenece al usuario
- **Pet events** usan enum `event_type`: `['vaccination', 'weight', 'deworming', 'medication', 'other']`
