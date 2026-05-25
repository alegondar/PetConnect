## Why

Supabase migró la firma de JWTs de HS256 (simétrico) a ECC P-256 (asimétrico, ES256). El backend actual usa `jwt.decode(token, secret, algorithms=["HS256"])` en `get_current_user`, que falla al recibir tokens firmados con ES256. Esto causa que **todas** las peticiones autenticadas retornen 401. El cliente Supabase ya ofrece `supabase.auth.get_user(token)` que valida el token contra la API de Supabase sin preocuparse por el algoritmo de firma.

## What Changes

- Reemplazar `jwt.decode(token, JWT_SECRET, algorithms=["HS256"])` por `supabase.auth.get_user(token)` en `backend/app/core/auth.py`
- Eliminar la dependencia de `python-jose` y `JWT_SECRET` para la verificación de tokens
- Mantener el lookup del perfil en la tabla `profiles` usando `user_id` retornado por Supabase
- Eliminar la importación de `jose` (`jwt`, `JWTError`) del archivo

## Capabilities

### New Capabilities

- `supabase-token-verification`: Verificación de tokens JWT de Supabase usando el cliente oficial `supabase.auth.get_user()` en lugar de decodificación manual con algoritmo fijo

### Modified Capabilities

<!-- No existing specs to modify — pet-photo-upload ya tiene escenarios de verificación JWT pero no especifica el algoritmo -->

## Impact

- `backend/app/core/auth.py` — reescritura de `get_current_user`: eliminar lógica de `jwt.decode`, usar `supabase.auth.get_user(token)`  
- `backend/app/config.py` — `JWT_SECRET` deja de ser necesario para la verificación de tokens (aún puede usarse para otras operaciones)
- `backend/requirements.txt` — `python-jose` podría eliminarse si no tiene otros usos
- No afecta al frontend ni a la API — el contrato del header `Authorization: Bearer <token>` se mantiene
