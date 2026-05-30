## hono-instapet — Routers de InstaPet social (posts, followers, milestones)

### Endpoints — InstaPet Posts

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/pets/{pet_id}/instapet/posts` | Sí | Listar posts del perfil (paginado) |
| POST | `/pets/{pet_id}/instapet/posts` | Sí | Publicar en el perfil |
| GET | `/pets/{pet_id}/instapet/posts/{post_id}` | Sí | Detalle del post |
| DELETE | `/pets/{pet_id}/instapet/posts/{post_id}` | Sí | Eliminar post |

### Endpoints — Followers

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/pets/{pet_id}/followers` | Sí | Listar seguidores (paginado) |
| POST | `/pets/{pet_id}/follow` | Sí | Seguir mascota |
| DELETE | `/pets/{pet_id}/follow` | Sí | Dejar de seguir |
| GET | `/me/following` | Sí | Mascotas que sigo (paginado) |

### Endpoints — Milestones

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/pets/{pet_id}/milestones` | Sí | Listar hitos de vida (paginado) |
| POST | `/pets/{pet_id}/milestones` | Sí | Registrar hito de vida |

### Zod Schemas

- `CreateInstaPetPostRequest`: `{ photo_url?: string, video_url?: string, description?: string }`
- `InstaPetPostDetail`: extiende InstaPetPost con `pet: Pet`
- `CreateMilestoneRequest`: `{ title: string, description?: string, photo_url?: string, milestone_date: string }`
- `InstaPetFollower`: incluye `follower: Profile`
- `FollowingPet`: `{ pet_id, pet_name, pet_photo_url, species, followed_at }`

### Comportamiento

- **POST instapet/posts**: Verificar que el pet pertenece al usuario (`owner_id === userId`)
- **DELETE instapet/posts**: Solo el autor del post
- **POST follow**: Verificar que no exista ya (409 Conflict si duplicado), insertar en `instapet_followers`
- **DELETE follow**: Eliminar registro de `instapet_followers`
- **GET followers**: Join con `profiles` para datos del follower
- **GET /me/following**: Query `instapet_followers` donde `follower_id === userId`, join con `pets`
- **Milestones**: Verificar que el pet pertenece al usuario
