## Context

El backend Hono en `backend-node/` ya expone `GET /api/v1/auth/me` y `PUT /api/v1/auth/me`. El PUT solo acepta `username`, `avatar_url` y `bio`. No existe endpoint DELETE ni flujo de recuperación de contraseña. El frontend tiene `LoginPage` sin link de "olvidé mi contraseña" ni página de settings.

El usuario describió exactamente qué quiere: una página `/settings` con secciones bien definidas, usando Supabase Auth para los flujos de email/contraseña y Supabase Storage para avatares. El diseño debe seguir la paleta actual (fondo negro, violeta/rosa, fuente Fredoka).

## Goals / Non-Goals

**Goals:**
- Página `/settings` con secciones Perfil, Cuenta, Notificaciones, Sesión, Zona de peligro
- Subida de avatar a bucket `avatars` en Supabase Storage
- Edición de username (con validación de unicidad), full_name y bio vía PUT `/api/v1/auth/me`
- Cambio de email vía `supabase.auth.updateUser({ email })` con confirmación por mail
- Cambio de contraseña vía `supabase.auth.updateUser({ password })`
- Recuperación de contraseña con magic link (ForgotPassword + ResetPassword)
- DELETE `/api/v1/auth/me` usando service role key para `auth.admin.deleteUser`
- Cerrar sesión (simple) y cerrar en todos los dispositivos
- Eliminar cuenta con modal de confirmación requiriendo escribir el email
- Icono ⚙️ en el header que navega a `/settings`

**Non-Goals:**
- Notificaciones funcionales (solo placeholder con "Próximamente")
- Cambio de email sin confirmación
- Eliminar cuenta sin modal de confirmación
- Panel de administración

## Decisions

### 1. Avatar se sube desde el frontend directamente a Supabase Storage

**Decisión**: El componente `AvatarUpload` usa `supabase.storage.from('avatars').upload()` directamente desde el frontend, luego guarda la URL pública resultante en el perfil vía PUT `/api/v1/auth/me`.

**Alternativa considerada**: Subir vía endpoint backend (como `POST /api/v1/pets/upload-photo`). Rechazado porque agrega un hop innecesario y el bucket `avatars` es público (fotos de perfil). El frontend ya tiene la session de Supabase y puede subir directo con las RLS correctas.

### 2. DELETE de cuenta usa service role desde el backend

**Decisión**: El frontend llama a `DELETE /api/v1/auth/me` (con JWT de usuario). El backend usa `supabaseAdmin` (service role) para llamar a `auth.admin.deleteUser(userId)`, luego borra el perfil de `profiles`.

**Alternativa considerada**: Llamar a `supabase.auth.admin.deleteUser()` desde el frontend. Rechazado porque expone la service role key en el cliente.

### 3. Cambio de email usa Supabase Auth directamente

**Decisión**: El frontend llama a `supabase.auth.updateUser({ email: nuevoEmail })` que envía un email de confirmación a la nueva dirección. El cambio se aplica cuando el usuario confirma desde ese mail. Esto no requiere endpoint backend nuevo.

### 4. Recuperación de contraseña usa magic link

**Decisión**: `supabase.auth.resetPasswordForEmail(email, { redirectTo: '/settings/reset-password' })`. El link en el mail redirige a `/settings/reset-password` con un token en la URL. `ResetPasswordPage` captura el token y llama a `supabase.auth.updateUser({ password })`.

### 5. full_name se agrega al schema de profiles y al PUT

**Decisión**: Ampliar `UpdateProfileRequest` (Zod) con `full_name: z.string().optional()`. El PUT `/api/v1/auth/me` acepta y persiste el campo en la tabla `profiles`. Requiere que la tabla `profiles` tenga columna `full_name` (si no existe, se agrega con ALTER TABLE).

## Risks / Trade-offs

- **[Riesgo] Colisión de usernames**: Si dos usuarios intentan tomar el mismo username, el PUT fallará por constraint UNIQUE. → El frontend debe mostrar error claro ("Ese nombre de usuario ya está en uso").
- **[Riesgo] Bucket avatars no existe**: Si no se creó el bucket, la subida falla. → Incluir paso de creación de bucket en las tasks (SQL o Supabase Dashboard).
- **[Riesgo] DELETE de cuenta no limpia datos huérfanos**: Posts, comentarios, likes del usuario quedan con `user_id` roto. → A futuro considerar soft-delete o cascade. Por ahora es aceptable porque el perfil se borra pero los posts pueden quedar como "anónimos".
- **[Riesgo] RLS en profiles**: Si la RLS de `profiles` no permite UPDATE/DELETE con service role, fallará con 42501. → Verificar y aplicar `WITH CHECK (true)` si es necesario.
- **[Trade-off] No hay confirmación de eliminación desde el mail**: Solo se pide escribir el email en un modal. → Es suficiente para MVP; un doble factor (mail de confirmación) sería más seguro pero agrega fricción.
