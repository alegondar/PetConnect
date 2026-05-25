## 1. Setup y utilidades

- [x] 1.1 Escribir extensiones (`uuid-ossp`, `pgcrypto`) y comentario inicial del archivo
- [x] 1.2 Crear función `update_updated_at_column()` y aplicarla como trigger automático

## 2. Auth (profiles)

- [x] 2.1 Crear tabla `profiles` vinculada a `auth.users`
- [x] 2.2 Crear función trigger `handle_new_user()` para auto-crear perfil al registrarse
- [x] 2.3 Agregar índices y políticas RLS en `profiles`

## 3. Pets, vet visits y pet events

- [x] 3.1 Crear tabla `pets` con sus constraints e índices
- [x] 3.2 Crear tabla `vet_visits` con FK cascade a `pets`
- [x] 3.3 Crear tabla `pet_events` con CHECK en `event_type`
- [x] 3.4 Agregar políticas RLS en las 3 tablas

## 4. Social (posts, likes, comments, ranking)

- [x] 4.1 Crear tabla `posts` con contadores `likes_count` y `comments_count`
- [x] 4.2 Crear tabla `likes` con UNIQUE(user_id, post_id)
- [x] 4.3 Crear tabla `comments` con FK cascade a `posts`
- [x] 4.4 Crear triggers para mantener `likes_count` y `comments_count` en `posts`
- [x] 4.5 Crear vista materializada `weekly_ranking`
- [x] 4.6 Agregar índices y políticas RLS en las 3 tablas

## 5. Community (lost pets, adoptions)

- [x] 5.1 Crear tabla `lost_pets` con columnas `last_seen_lat` y `last_seen_lng`
- [x] 5.2 Crear tabla `adoptions` con CHECK en `status`
- [x] 5.3 Agregar índices y políticas RLS en ambas tablas
