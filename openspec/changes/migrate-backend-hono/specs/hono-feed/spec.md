## hono-feed — Router de feed social (posts, likes, comentarios)

### Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/feed` | Sí | Feed global de posts (paginado) |
| POST | `/feed` | Sí | Crear nuevo post |
| GET | `/feed/{post_id}` | Sí | Detalle de post (con liked_by_me) |
| DELETE | `/feed/{post_id}` | Sí | Eliminar post (solo autor) |
| POST | `/feed/{post_id}/like` | Sí | Dar like |
| DELETE | `/feed/{post_id}/like` | Sí | Quitar like |
| GET | `/feed/{post_id}/comments` | Sí | Listar comentarios (paginado) |
| POST | `/feed/{post_id}/comments` | Sí | Comentar |
| DELETE | `/feed/{post_id}/comments/{comment_id}` | Sí | Eliminar comentario (autor del comentario o del post) |

### Zod Schemas

- `CreatePostRequest`: `{ pet_id: z.string().uuid(), content?: string, photo_url?: string }`
- `CreateCommentRequest`: `{ content: z.string() }`
- `Post`: incluye `author` (Profile) y `pet` (Pet) como relaciones expandidas
- `PostDetail`: extiende Post con `liked_by_me: boolean`

### Comportamiento

- **GET /feed**: Join con `profiles` (author) y `pets` (pet), orden `created_at DESC`
- **POST /feed**: Validar que `pet_id` pertenece al usuario (`pets.owner_id === userId`)
- **GET /feed/{post_id}**: Query extra para verificar si el usuario dio like (`liked_by_me`)
- **POST /feed/{post_id}/like**: Insertar en `likes`, incrementar `likes_count` en `posts` (o usar trigger DB)
- **DELETE /feed/{post_id}/like**: Eliminar de `likes`, decrementar contador
- **POST /feed/{post_id}/comments**: Insertar en `comments`, incrementar `comments_count`
- **DELETE comments**: Solo el autor del comentario (`user_id`) o el autor del post puede eliminar

### Contadores

- `likes_count` y `comments_count` se leen directamente de la tabla `posts`
- Asumimos que la DB tiene triggers o se actualizan manualmente
- Estrategia: al dar like, hacer update atómico `{ likes_count: posts.likes_count + 1 }` (alternativa: consultar count real)
