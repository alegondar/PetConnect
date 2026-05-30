## hono-auth — Router de autenticación

### Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Registrar usuario con email, password, username |
| POST | `/auth/login` | No | Login con email, password |
| GET | `/auth/me` | Sí | Obtener perfil del usuario autenticado |
| PUT | `/auth/me` | Sí | Actualizar perfil (username, avatar_url, bio) |

### Zod Schemas

- `RegisterRequest`: `{ email: z.string().email(), password: z.string().min(6), username: z.string() }`
- `LoginRequest`: `{ email: z.string().email(), password: z.string() }`
- `UpdateProfileRequest`: `{ username?: string, avatar_url?: string, bio?: string }`
- `AuthResponse`: `{ access_token: string, token_type: string, profile: Profile }`
- `Profile`: `{ id, user_id, username, avatar_url, bio, created_at, updated_at }`

### Comportamiento

- **POST /auth/register**: Usar `supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { username } })`, insertar perfil en tabla `profiles`, retornar token + profile
- **POST /auth/login**: Usar `supabase.auth.signInWithPassword({ email, password })`, obtener perfil de `profiles`, retornar token + profile
- **GET /auth/me**: Leer `userId` del contexto, obtener perfil de `profiles` por `user_id`
- **PUT /auth/me**: Validar body con zod, actualizar `profiles` por `user_id`, retornar perfil actualizado

### Respuestas de error

- 409 si email ya registrado
- 401 si credenciales inválidas
- 404 si perfil no encontrado
