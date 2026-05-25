## Context

PetConnect usa Supabase Auth como proveedor de identidad. El backend recibe el token JWT de Supabase que el frontend envía en el header `Authorization: Bearer <token>`. Para verificar ese token, el backend necesita el secreto JWT de Supabase (`sb_secret_...`) configurado en `JWT_SECRET`. Actualmente el `.env` tiene `SECRET_KEY` pero el código lee `JWT_SECRET`, que no existe, y cae al fallback `SUPABASE_SERVICE_KEY` (un JWT, no un secreto HMAC). Esto rompe la verificación de firma en `backend/app/core/auth.py:15`.

Además, al crear una mascota (`POST /pets`), el endpoint `create_pet` usa `user["user_id"]` como `owner_id`, pero la tabla `pets.owner_id` referencia `profiles(id)` (el UUID del perfil), no `profiles.user_id` (el UUID de auth). El resto de endpoints (update, delete, verify_owner) ya usan `user["id"]` correctamente.

En el frontend, la subida de imagen envía `Content-Type: multipart/form-data` manualmente, lo que elimina el boundary requerido por el protocolo multipart. Axios debe generar este header automáticamente cuando el body es `FormData`.

## Goals / Non-Goals

**Goals:**
- Verificar correctamente los tokens JWT de Supabase usando el secreto configurado en `.env`
- Asegurar que `create_pet` use el UUID del perfil (`profiles.id`) como `owner_id`, consistente con el schema y el resto de endpoints
- Permitir subida de fotos de mascota sin errores de formato multipart
- Evitar redirecciones falsas al login por errores de autenticación

**Non-Goals:**
- No se modifica el schema de base de datos
- No se cambia el flujo de login/registro
- No se implementa refresh automático de tokens
- No se modifica el comportamiento del interceptor de Axios (ya funciona correctamente)

## Decisions

**1. Leer `SECRET_KEY` como fallback en `JWT_SECRET`**

Decisión: Modificar `config.py` para usar `os.getenv("SECRET_KEY")` si `JWT_SECRET` no está definido.

Alternativa: Renombrar la variable en `.env`.  
Razón: Cambiar el código es menos disruptivo que cambiar el `.env` (podría haber otros servicios usando `SECRET_KEY`). La función `or` encadenada permite ambas opciones: `os.getenv("JWT_SECRET") or os.getenv("SECRET_KEY") or SUPABASE_SERVICE_KEY`.

**2. Usar `user["id"]` en `create_pet`**

Decisión: Cambiar `user["user_id"]` por `user["id"]` en `backend/app/routers/pets.py:49`.

Alternativa: Cambiar el schema para que `pets.owner_id` referencia `profiles.user_id`.  
Razón: 15+ endpoints en el código ya usan `user["id"]`. El schema ya referencia `profiles(id)`. Cambiar un solo endpoint es el fix mínimo y consistente.

**3. Eliminar header `Content-Type` manual en upload multipart**

Decisión: Quitar `headers: { 'Content-Type': 'multipart/form-data' }` del `api.post()` en `MyPetsPage.tsx`.

Alternativa: Agregar el boundary manualmente con `FormData.getBoundary()`.  
Razón: Axios + browser generan automáticamente el header correcto con boundary cuando detectan que el body es `FormData`. La intervención manual es innecesaria y contraproducente.

**4. Interceptor de Axios: sin cambios necesarios**

Decisión: Mantener `frontend/src/api/client.ts` sin modificaciones.

Verificación: El interceptor lee correctamente `localStorage.getItem('auth-storage')`, extrae `state.token` del JSON parseado, y lo asigna como `Authorization: Bearer <token>`. El Zustand persist middleware almacena bajo la key `auth-storage` con la estructura `{ state: { token: "...", profile: {...} } }`, que coincide con lo que espera el interceptor.

## Risks / Trade-offs

- **[Riesgo]** Si el bucket `pets` no existe en Supabase Storage, la subida fallará con error 500 → Mitigación: crear el bucket manualmente en Supabase Dashboard o documentar en README.
- **[Riesgo]** Si `SECRET_KEY` y `JWT_SECRET` tienen valores diferentes, la verificación usará `SECRET_KEY` por precedencia → Mitigación: documentar que `JWT_SECRET` tiene prioridad sobre `SECRET_KEY`.
- **[Trade-off]** No se implementa refresh automático de token → Aceptado: los tokens de Supabase Auth tienen duración configurable (por defecto 1h), suficiente para la sesión típica de uso.
