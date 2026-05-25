## 1. Reemplazar verificación JWT manual por Supabase Auth

- [x] 1.1 En `backend/app/core/auth.py`, eliminar la importación de `jose` (`jwt`, `JWTError`)
- [x] 1.2 En `backend/app/core/auth.py`, reemplazar `jwt.decode(token, JWT_SECRET, algorithms=["HS256"], options={"verify_aud": False})` por `supabase.auth.get_user(token)` usando el cliente de `get_supabase()`
- [x] 1.3 Extraer `user_id` del resultado de `supabase.auth.get_user(token)` (estructura: `response.user.id`)
- [x] 1.4 Mantener el lookup del perfil en la tabla `profiles` con `user_id` y el manejo de 401 si no existe
- [x] 1.5 Eliminar la importación de `JWT_SECRET` del archivo (ya no se usa para verificación)

## 2. Verificación del backend

- [x] 2.1 Ejecutar `python -c "from app.core.auth import get_current_user; print('OK')"` para confirmar que el módulo carga sin errores
- [x] 2.2 Probar `POST /auth/login` → obtener token → `GET /auth/me` con el token → debe retornar 200 y el perfil

## 3. Limpieza de dependencias (opcional)

- [x] 3.1 Revisar si `python-jose` y `JWT_SECRET` se usan en otros módulos del backend
- [x] 3.2 Si `python-jose` no tiene otros usos, eliminarlo de `backend/requirements.txt`
