## 1. Fix crítico: Auth middleware

- [x] 1.1 Modificar `src/middleware/auth.ts`: después de validar JWT, consultar `profiles.id` WHERE `user_id = auth.user.id` y usar ese ID en `c.set("userId", profile.id)`
- [x] 1.2 Verificar que `c.get("userId")` ahora es `profiles.id` (UUID_P) y todos los routers siguen funcionando

## 2. Fix: Ranking

- [x] 2.1 Reescribir `src/routes/ranking.ts` para consultar tabla `weekly_ranking` en vez de calcular desde `likes`

## 3. Fix: PetFriendly

- [x] 3.1 Actualizar `src/schemas/petfriendly.ts`: 4 categorías (no 7), agregar `fuente` y `verificado`
- [x] 3.2 Actualizar `src/routes/petfriendly.ts`: agregar `fuente: "usuario"` al crear lugar

## 4. Fix: Feed routes

- [x] 4.1 Modificar delete comment en `src/routes/feed.ts`: solo el autor del comentario puede eliminar (no el autor del post)
- [x] 4.2 Agregar validación en update post: si `updateData` está vacío, retornar 400

## 5. Verificación final

- [x] 5.1 `npx tsc --noEmit` sin errores
- [x] 5.2 Servidor levanta en puerto 8000
- [x] 5.3 Testear auth: register → login → crear mascota → verificar ownership
- [x] 5.4 Testear ranking: `GET /api/v1/ranking` devuelve datos de `weekly_ranking`
- [x] 5.5 Testear pet-friendly: crear lugar con `fuente: "usuario"`, verificar 4 categorías
