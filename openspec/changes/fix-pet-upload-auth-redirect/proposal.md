## Why

Al crear una mascota con foto en "Mis Pets", el usuario es redirigido al login. Esto ocurre porque la subida de imagen al backend (`POST /pets/upload-photo`) retorna 401, y el interceptor de Axios en el frontend interpreta el 401 como sesión expirada redirigiendo a `/login`. La causa raíz es triple: (1) `JWT_SECRET` no está configurado correctamente en el backend, (2) `create_pet` usa el UUID de auth en lugar del UUID del perfil como `owner_id`, y (3) el frontend envía un header `Content-Type` manual incorrecto en la subida multipart.

## What Changes

- Corregir `backend/app/config.py`: leer `SECRET_KEY` como fallback para `JWT_SECRET` (actualmente solo lee `JWT_SECRET`, pero el `.env` define `SECRET_KEY`)
- Corregir `backend/app/routers/pets.py`: cambiar `create_pet` para usar `user["id"]` (profile UUID) en vez de `user["user_id"]` (auth UUID), alineando con el resto de endpoints
- Corregir `frontend/src/pages/MyPetsPage.tsx`: eliminar el header `Content-Type: multipart/form-data` manual para que axios genere el boundary automático
- Verificar `frontend/src/api/client.ts`: el interceptor de Axios ya envía correctamente el token JWT desde `localStorage('auth-storage')` en cada request — confirmar y documentar

## Capabilities

### New Capabilities

- `pet-photo-upload`: Subida de foto de mascota a Supabase Storage con autenticación JWT correcta y manejo de errores sin redirección falsa al login

### Modified Capabilities

<!-- No existing specs to modify -->

## Impact

- `backend/app/config.py` — cambio en la lectura de `JWT_SECRET`
- `backend/app/routers/pets.py` — corrección de `owner_id` en `create_pet` y endpoint `/upload-photo`
- `frontend/src/pages/MyPetsPage.tsx` — eliminación de header manual en subida multipart
- `frontend/src/api/client.ts` — revisión del interceptor (sin cambios necesarios, funciona correctamente)
- `backend/requirements.txt` — se agregó `python-multipart` como dependencia
