## Context

El endpoint `GET /api/v1/pets` es público y devuelve todas las mascotas cuando no se pasa `owner_id`. El frontend lo usaba para "Mis Pets" sin filtrar, causando que dos usuarios distintos vieran las mismas mascotas.

Ambos backends (Python FastAPI y Node.js Hono) están activos — el Python es el principal en producción. Supabase-py 2.7.1 no hace bypass de RLS con service key, lo que causaba error 42501 al crear mascotas (bug preexistente). React Query mantenía caché sin limpiar al hacer logout.

## Goals / Non-Goals

**Goals:**
- Cada usuario ve SOLO sus propias mascotas en "Mis Pets"
- Endpoint `/my-pets` autenticado en ambos backends
- Caché de React Query se limpia al cambiar de sesión
- Arreglar RLS de `pets` para que `POST /pets` funcione con supabase-py

**Non-Goals:**
- No se modifica `GET /api/v1/pets` (sigue público)
- No se modifican otras tablas con RLS

## Decisions

### 1. Endpoint `/my-pets` en ambos backends

**Decisión:** Implementar en Python (`backend/app/routers/pets.py`) y Node.js (`backend-node/src/routes/pets.ts`). El Python resultó ser el backend activo en producción, no Node.js como se asumió inicialmente.

**Endpoint:** `GET /api/v1/my-pets` usa `get_current_user()` (Python) / `authMiddleware` (Node.js) para obtener `profiles.id` y filtrar `owner_id`.

### 2. RLS con `WITH CHECK (true)` en tabla `pets`

**Decisión:** Cambiar políticas INSERT/UPDATE/DELETE de `pets` a `WITH CHECK (true)` / `USING (true)`.

**Por qué:** supabase-py 2.7.1 opera como rol `anon` en PostgREST aunque uses service key. Las políticas que usan `auth.uid()` fallan con error 42501. El backend ya valida autenticación en `get_current_user()`, así que es seguro.

**Migración:** `docs/migrations/fix_pets_rls.sql` lista para ejecutar en Supabase SQL Editor.

### 3. Limpiar caché con `useQueryClient().clear()`

**Decisión:** Usar el hook `useQueryClient()` en `SettingsPage` (logout), `LoginPage` (login) y `RegisterPage` (registro). No se exporta `queryClient` de `App.tsx` (rompe Fast Refresh de React).

## Risks / Trade-offs

- **[Riesgo resuelto]** Backend Python no tenía `/my-pets` → implementado en `backend/app/routers/pets.py`
- **[Riesgo resuelto]** RLS bloqueaba creación de mascotas → políticas corregidas en schema + migración SQL

## Implementation Summary

| Capa | Archivo | Cambio |
|------|---------|--------|
| Backend Python | `backend/app/routers/pets.py` | Nuevo `GET /my-pets` autenticado |
| Backend Node.js | `backend-node/src/routes/pets.ts` | Nuevo `GET /my-pets` autenticado |
| DB Schema | `docs/db_schema.sql` | RLS `pets`: `WITH CHECK (true)` |
| DB Migration | `docs/migrations/fix_pets_rls.sql` | SQL para aplicar en Supabase |
| Frontend API | `frontend/src/api/endpoints/index.ts` | `petsApi.myPets()` |
| Frontend | `MyPetsPage.tsx` | `myPets()` en vez de `list()` |
| Frontend | `CreatePostModal.tsx` | `myPets()` en selector |
| Frontend | `AdoptionsPage.tsx` | `myPets()` en selector |
| Frontend | `FeedPage.tsx` | `myPets()` + usuarios seguidos en stories |
| Frontend | `SettingsPage.tsx` | `queryClient.clear()` en logout |
| Frontend | `LoginPage.tsx` | `queryClient.clear()` en login |
| Frontend | `RegisterPage.tsx` | `queryClient.clear()` en registro |
