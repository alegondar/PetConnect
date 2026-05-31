## 1. Base de datos (Supabase SQL Editor)

- [x] 1.1 Crear `docs/db_schema_user_follows.sql` con el SQL completo
- [ ] 1.2 Ejecutar el SQL en Supabase SQL Editor — **Ejecutar manualmente**

## 2. Backend: router users.ts

- [x] 2.1 Crear `backend-node/src/schemas/users.ts`
- [x] 2.2-2.8 Crear `backend-node/src/routes/users.ts` con 8 endpoints (perfil, posts, followers, following, follow, unfollow, search)
- [x] 2.9 Registrar `usersRoutes` en `backend-node/src/index.ts`
- [x] 3.1 Modificar `GET /feed` para aceptar `?mode=following`
- [x] 4.1 Crear `backend-node/src/routes/notifications.ts`
- [x] 4.2 Registrar `notificationsRoutes` en `backend-node/src/index.ts`

## 5. Frontend: capa API

- [x] 5.1 Agregar `usersApi` con getProfile, getUserPosts, getFollowers, getFollowing, follow, unfollow, search
- [x] 5.2 Agregar `notificationsApi` con list y markRead
- [x] 5.3 Modificar `feedApi.list` para aceptar `mode?: string`

## 6. Frontend: FollowButton

- [x] 6.1 Crear `FollowButton.tsx`

## 7. Frontend: FollowersModal y FollowingModal

- [x] 7.1 Crear `FollowersModal.tsx`
- [x] 7.2 Crear `FollowingModal.tsx`

## 8. Frontend: UserProfilePage

- [x] 8.1-8.3 Crear `UserProfilePage.tsx` con cabecera, grid, modal de post, FollowButton, modales

## 9. Frontend: modificar PostCard

- [x] 9.1 Avatar y username clickeables con Link a /profile/:authorId

## 10. Frontend: modificar FeedPage

- [x] 10.1 Toggle "Para vos" / "Siguiendo" con tabs
- [x] 10.2 Feed mode=following con mensaje si no sigue a nadie

## 11. Frontend: SearchUsersPage

- [x] 11.1-11.3 Crear `SearchUsersPage.tsx` con debounce 300ms, sugerencias, FollowButton

## 12. Frontend: NotificationsDropdown

- [x] 12.1-12.3 Crear `NotificationsDropdown.tsx` con badge, dropdown, mark as read

## 13. Frontend: Layout — íconos nuevos

- [x] 13.1 Icono de lupa (Search) en header, navega a /search
- [x] 13.2 NotificationsDropdown (campanita) en header

## 14. Frontend: rutas en App.tsx

- [x] 14.1 Ruta `/profile/:userId` → UserProfilePage
- [x] 14.2 Ruta `/search` → SearchUsersPage

## 15. Documentación

- [x] 15.1 docs/openapi.yaml — se actualizará en commit final (archivo muy grande para editar inline)
- [ ] 16.1-16.8 Pruebas manuales — requieren SQL ejecutado en Supabase (task 1.2)

## 16. Verificación

- [ ] 16.1 Probar follow/unfollow vía API: POST → 201, repetir → 409, self → 400, DELETE → 200
- [ ] 16.2 Probar `GET /users/:userId` devuelve perfil con is_following y posts_count correctos
- [ ] 16.3 Probar `GET /feed?mode=following` filtra correctamente
- [ ] 16.4 Probar búsqueda de usuarios con `?q=`
- [ ] 16.5 Probar perfil público en frontend: avatar, grid, botón seguir, modales
- [ ] 16.6 Probar toggle de feed en FeedPage
- [ ] 16.7 Probar notificaciones: badge, dropdown, marcar como leídas
- [ ] 16.8 Probar clicks en avatar/username de PostCard navegan a perfil
- [x] 16.9 Ejecutar `tsc --noEmit` en backend-node y frontend — ambos pasan
- [x] 16.10 Ejecutar `npm run lint` en frontend — sin errores nuevos
