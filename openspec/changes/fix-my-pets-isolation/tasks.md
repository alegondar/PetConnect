## 1. Backend: Nuevo endpoint `/my-pets`

- [x] 1.1 Añadir `GET /my-pets` en `backend-node/src/routes/pets.ts` y `backend/app/routers/pets.py` con auth, filtrando por `profiles.id`
- [x] 1.2 Verificar que el endpoint retorna 401 sin token y 200 con lista paginada filtrada

## 2. Backend: Fix RLS en tabla pets

- [x] 2.1 Cambiar políticas RLS de INSERT/UPDATE/DELETE a `WITH CHECK (true)` por incompatibilidad con supabase-py
- [x] 2.2 Crear migración SQL en `docs/migrations/fix_pets_rls.sql`

## 3. Frontend: API client

- [x] 3.1 Añadir `myPets()` en `frontend/src/api/endpoints/index.ts` que llame a `GET /api/v1/my-pets`

## 4. Frontend: Actualizar componentes que usan `petsApi.list()` para "Mis Pets"

- [x] 4.1 Cambiar `MyPetsPage.tsx` para usar `petsApi.myPets()` en vez de `petsApi.list()`
- [x] 4.2 Cambiar `CreatePostModal.tsx` para usar `petsApi.myPets()` en el selector de mascota
- [x] 4.3 Cambiar `AdoptionsPage.tsx` (AdoptionForm) para usar `petsApi.myPets()` en el selector
- [x] 4.4 Cambiar `FeedPage.tsx` (PetStories) para usar `petsApi.myPets()` y mostrar usuarios seguidos

## 5. Frontend: Limpiar caché React Query en cambio de sesión

- [x] 5.1 Añadir `useQueryClient().clear()` en `handleLogout` de `SettingsPage.tsx`
- [x] 5.2 Añadir `useQueryClient().clear()` en `LoginPage.tsx` al hacer login exitoso
- [x] 5.3 Añadir `useQueryClient().clear()` en `RegisterPage.tsx` al registrarse exitosamente

## 6. Verificación

- [x] 6.1 Verificar compilación TypeScript en frontend y backend
- [x] 6.2 Verificar lint en frontend (sin nuevos errores)
- [x] 6.3 Probar con dos usuarios distintos que cada uno ve solo sus mascotas en `/my-pets`
- [x] 6.4 Probar que al hacer logout + login con otro usuario no se filtran mascotas del usuario anterior
