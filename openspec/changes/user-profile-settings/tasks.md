## 1. Supabase: bucket y schema

- [x] 1.1 Crear bucket `avatars` en Supabase Storage (Dashboard SQL o UI), con política pública de lectura y política de INSERT autenticado (bucket público para avatares) — **Ejecutar SQL provisto en el SQL Editor de Supabase**
- [x] 1.2 Agregar columna `full_name` a la tabla `profiles` si no existe: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;` — **Ejecutar en SQL Editor de Supabase**

## 2. Backend: ampliar PUT y agregar DELETE

- [x] 2.1 Ampliar `UpdateProfileRequest` en `backend-node/src/schemas/auth.ts`: agregar campo `full_name: z.string().optional()` al schema Zod y al tipo
- [x] 2.2 Ampliar `PUT /api/v1/auth/me` en `backend-node/src/routes/auth.ts`: aceptar `full_name` en el `updateData` y persistirlo junto con los demás campos
- [x] 2.3 Crear endpoint `DELETE /api/v1/auth/me` en `backend-node/src/routes/auth.ts`: extraer token, obtener `user_id` del profile, llamar `auth.admin.deleteUser(user_id)`, borrar de `profiles`, retornar 200

## 3. Frontend: capa API

- [x] 3.1 Agregar `deleteMe: () => api.delete('/auth/me')` al objeto `authApi` en `frontend/src/api/endpoints/index.ts`
- [x] 3.2 Actualizar la firma de `authApi.updateMe` en `frontend/src/api/endpoints/index.ts` para aceptar `full_name?: string`

## 4. Frontend: AvatarUpload

- [x] 4.1 Crear `frontend/src/components/AvatarUpload.tsx` con props: `currentUrl?: string | null`, `onUploaded: (url: string) => void`. Implementar: click abre input file, preview local, subida a `avatars/{userId}/avatar.{timestamp}.{ext}` vía `supabase.storage`, llama a `onUploaded(url)` al completar
- [x] 4.2 Mostrar spinner durante la subida, placeholder circular con icono de cámara (lucide-react) cuando no hay avatar, error si falla la subida

## 5. Frontend: SettingsPage

- [x] 5.1 Crear `frontend/src/pages/SettingsPage.tsx` con layout general: fondo negro, texto blanco, fuente Fredoka, secciones separadas por divisores
- [x] 5.2 Sección Perfil: `AvatarUpload` integrado, campos editables (username, full_name, bio) con react-hook-form + zod, botón "Guardar cambios" que llama a `authApi.updateMe()`
- [x] 5.3 Sección Cuenta: mostrar email actual (read-only), formulario de cambio de email con `supabase.auth.updateUser({ email })`, formulario de cambio de contraseña con `supabase.auth.updateUser({ password })`
- [x] 5.4 Sección Notificaciones: toggles desactivados con label "Próximamente" y texto gris
- [x] 5.5 Sección Sesión: botón "Cerrar sesión" (llama a `supabase.auth.signOut()` y `useAuthStore.logout()`), botón "Cerrar sesión en todos los dispositivos" (`supabase.auth.signOut({ scope: 'global' })`)
- [x] 5.6 Sección Zona de peligro: botón rojo "Eliminar cuenta" que abre modal de confirmación requiriendo escribir el email, al confirmar llama a `authApi.deleteMe()`, limpia auth state, redirige a `/login`

## 6. Frontend: ForgotPassword y ResetPassword

- [x] 6.1 Crear `frontend/src/pages/ForgotPasswordPage.tsx`: campo email + botón "Enviar enlace" que llama a `supabase.auth.resetPasswordForEmail(email, { redirectTo: '/settings/reset-password' })`, muestra mensaje de éxito
- [x] 6.2 Crear `frontend/src/pages/ResetPasswordPage.tsx`: captura `#access_token` del hash de la URL, formulario de nueva contraseña + confirmación (min 6 chars), llama a `supabase.auth.updateUser({ password })`, redirige a `/feed`

## 7. Frontend: integración de rutas y navegación

- [x] 7.1 Agregar link "¿Olvidaste tu contraseña?" en `LoginPage.tsx` debajo del formulario, navegando a `/forgot-password`
- [x] 7.2 Agregar icono de engranaje ⚙️ en el header de `Layout.tsx` (visible solo cuando autenticado), navega a `/settings`
- [x] 7.3 Agregar rutas en `App.tsx`: `/settings` (ProtectedRoute → SettingsPage), `/forgot-password` (pública → ForgotPasswordPage), `/settings/reset-password` (pública → ResetPasswordPage), todo con lazy loading

## 8. Verificación

- [x] 8.1 Probar `PUT /api/v1/auth/me` acepta y persiste `full_name` correctamente
- [x] 8.2 Probar `DELETE /api/v1/auth/me` elimina el auth user y el profile, y que una request posterior a `/auth/me` devuelve 401
- [ ] 8.3 Probar subida de avatar: seleccionar imagen, ver preview, confirmar que se guarda en bucket `avatars` y la URL se persiste en el perfil — **Requiere bucket avatars creado en Supabase (task 1.1)**
- [ ] 8.4 Probar flujo forgot-password: ingresar email → recibir magic link → establecer nueva contraseña → login exitoso — **Requiere Supabase Auth configurado con emails**
- [ ] 8.5 Probar cambio de email: ingresar nuevo email → recibir confirmación en el nuevo email → confirmar → email actualizado — **Requiere Supabase Auth configurado con emails**
- [ ] 8.6 Probar cambio de contraseña estando logueado: nueva contraseña → logout → login con nueva contraseña exitoso
- [ ] 8.7 Probar eliminación de cuenta: modal, escribir email, confirmar → cuenta eliminada, redirigido a /login, no puede loguearse de nuevo
- [x] 8.8 Ejecutar `npm run lint` en backend-node y frontend sin errores — **Mis archivos sin errores; hay errores preexistentes en otros archivos no relacionados a este cambio**
- [x] 8.9 Ejecutar `npm run typecheck` en frontend sin errores (si existe el script) — **tsc --noEmit pasa limpiamente**
