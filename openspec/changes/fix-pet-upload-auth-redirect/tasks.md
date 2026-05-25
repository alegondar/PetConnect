## 1. Backend — Corrección de JWT_SECRET

- [x] 1.1 Modificar `backend/app/config.py:11` para leer `SECRET_KEY` como fallback: `os.getenv("JWT_SECRET") or os.getenv("SECRET_KEY") or SUPABASE_SERVICE_KEY`
- [x] 1.2 Verificar que `JWT_SECRET` resuelve al valor `sb_secret_...` del `.env` ejecutando `python -c "from app.config import JWT_SECRET; print(JWT_SECRET[:20])"`
- [x] 1.3 Probar `POST /auth/login` y luego `GET /auth/me` con el token recibido para confirmar que la verificación JWT funciona

## 2. Backend — Corrección de create_pet owner_id

- [x] 2.1 Modificar `backend/app/routers/pets.py:49`: cambiar `user["user_id"]` por `user["id"]` en la llamada a `pet_service.create_pet`
- [x] 2.2 Verificar que todos los demás endpoints (`update_pet`, `delete_pet`, `verify_pet_owner`, etc.) ya usan `user["id"]` consistentemente
- [x] 2.3 Probar creación de mascota con `POST /pets` y verificar que `owner_id` coincide con `profiles.id`

## 3. Backend — Endpoint de upload de foto

- [x] 3.1 Verificar que `backend/app/routers/pets.py:18-29` tiene el endpoint `POST /pets/upload-photo` con autenticación vía `Depends(get_current_user)`
- [x] 3.2 Verificar que `backend/requirements.txt` incluye `python-multipart` y que está instalado (`pip list | grep multipart`)
- [x] 3.3 Probar upload con `curl -X POST http://localhost:8000/api/v1/pets/upload-photo -H "Authorization: Bearer <token>" -F "file=@test.jpg"`

## 4. Frontend — Corrección de subida multipart

- [x] 4.1 Modificar `frontend/src/pages/MyPetsPage.tsx:77`: eliminar `headers: { 'Content-Type': 'multipart/form-data' }` del `api.post('/pets/upload-photo', formData, ...)`
- [x] 4.2 Probar que al seleccionar una imagen y guardar, la mascota se crea con la URL de la foto y sin redirección al login

## 5. Frontend — Verificación del interceptor de Axios

- [x] 5.1 Revisar `frontend/src/api/client.ts:8-17`: confirmar que el interceptor lee `localStorage.getItem('auth-storage')`, parsea `state.token`, y lo asigna como `Authorization: Bearer <token>`
- [x] 5.2 Revisar `frontend/src/stores/authStore.ts`: confirmar que Zustand persist usa la key `auth-storage` y estructura `{ state: { token, profile } }`
- [x] 5.3 Verificar que una respuesta 401 limpia el localStorage y redirige a `/login`, pero errores 4xx/5xx no lo hacen
- [x] 5.4 Probar flujo completo: login → ir a Mis Pets → crear mascota con foto → verificar que aparece en el grid sin redirección al login

## 6. Verificación final

- [x] 6.1 Ejecutar `pnpm run --filter frontend build` y confirmar que compila sin errores
- [x] 6.2 Ejecutar `python -c "from app.routers.pets import router; print('OK')"` y confirmar que el backend carga sin errores
- [x] 6.3 Probar manualmente: subir una foto de mascota > 1MB y verificar que se almacena correctamente en Supabase Storage
