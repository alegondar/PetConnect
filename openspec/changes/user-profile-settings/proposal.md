## Why

PetConnect no tiene una página de configuración de perfil. Los usuarios no pueden cambiar su foto, nombre, bio, email, contraseña ni eliminar su cuenta sin intervención manual. Tampoco existe flujo de "olvidé mi contraseña". Esto frena la autonomía del usuario y es una expectativa básica de cualquier app social.

## What Changes

- Nueva página `/settings` con secciones: Perfil (foto, username, nombre completo, bio), Cuenta (cambiar email, cambiar contraseña), Notificaciones (placeholder), Sesión (cerrar sesión, cerrar en todos los dispositivos), Zona de peligro (eliminar cuenta)
- Icono de engranaje en el header (Layout) que navega a `/settings`
- Componente reutilizable `AvatarUpload` para subir foto de perfil a bucket `avatars` en Supabase Storage
- Página `ForgotPasswordPage` con campo de email que envía magic link de reset
- Página `ResetPasswordPage` que captura el token de la URL y permite ingresar nueva contraseña
- Link "Olvidé tu contraseña?" en LoginPage
- Endpoint `DELETE /api/v1/auth/me` para eliminar cuenta (usa service role key)
- Ampliar `PUT /api/v1/auth/me` para aceptar `full_name`
- Ampliar esquema Zod `UpdateProfileRequest` con `full_name`

## Capabilities

### New Capabilities

- `settings-page`: Página `/settings` con secciones de perfil, cuenta, notificaciones, sesión y zona de peligro. Estilo consistente con fondo negro, paleta violeta/rosa y Fredoka.
- `avatar-upload`: Componente reutilizable para subir imagen a Supabase Storage bucket `avatars`, con preview y carga asíncrona.
- `forgot-password`: Flujo de recuperación de contraseña: página de solicitud + página de reset con token.
- `delete-account`: Endpoint y UI para eliminación de cuenta con confirmación por email.

### Modified Capabilities

- `auth-api`: PUT `/api/v1/auth/me` ahora acepta `full_name`. Nuevo endpoint DELETE `/api/v1/auth/me`.
- `auth-ui`: LoginPage gana link de "Olvidé tu contraseña?". Layout gana icono de engranaje que navega a `/settings`.

## Impact

- `backend-node/src/routes/auth.ts` — Nuevo endpoint DELETE, PUT ampliado
- `backend-node/src/schemas/auth.ts` — UpdateProfileRequest con full_name
- `frontend/src/pages/SettingsPage.tsx` — Nueva página
- `frontend/src/components/AvatarUpload.tsx` — Nuevo componente
- `frontend/src/pages/ForgotPasswordPage.tsx` — Nueva página
- `frontend/src/pages/ResetPasswordPage.tsx` — Nueva página
- `frontend/src/pages/LoginPage.tsx` — Agregar link "Olvidé tu contraseña?"
- `frontend/src/components/Layout.tsx` — Agregar icono engranaje
- `frontend/src/api/endpoints/auth.ts` — Nuevas funciones API
- `frontend/src/App.tsx` — Nuevas rutas
- Supabase: crear bucket `avatars`
