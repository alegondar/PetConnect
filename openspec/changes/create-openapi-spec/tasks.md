## 1. Encabezado y configuración base

- [x] 1.1 Definir `openapi: 3.0.3`, `info` (título, descripción, versión), `servers` y `security` global
- [x] 1.2 Definir `components/securitySchemes` con Bearer JWT
- [x] 1.3 Definir schemas de error (`ErrorResponse`) y paginación (`PaginatedResponse`)

## 2. Schemas reutilizables

- [x] 2.1 Definir `Profile` schema
- [x] 2.2 Definir `Pet` schema
- [x] 2.3 Definir schemas para `VetVisit`, `PetEvent`
- [x] 2.4 Definir schemas para `Post`, `Like`, `Comment`
- [x] 2.5 Definir schemas para `RankingEntry`, `LostPet`, `Adoption`
- [x] 2.6 Definir schemas para `InstaPetPost`, `InstaPetFollower`, `InstaPetMilestone`
- [x] 2.7 Definir schemas de request (`CreatePetRequest`, `LoginRequest`, etc.)

## 3. Endpoints Auth

- [x] 3.1 `POST /api/v1/auth/register` y `POST /api/v1/auth/login`
- [x] 3.2 `GET /api/v1/auth/me` y `PUT /api/v1/auth/me`

## 4. Endpoints Pets

- [x] 4.1 CRUD de `/api/v1/pets` (GET lista, GET por ID, POST, PUT, DELETE)
- [x] 4.2 CRUD de `/api/v1/pets/{pet_id}/vet-visits`
- [x] 4.3 CRUD de `/api/v1/pets/{pet_id}/events`

## 5. Endpoints Social (Feed)

- [x] 5.1 `GET /api/v1/feed` (posts paginados) y `GET /api/v1/feed/{post_id}`
- [x] 5.2 `POST /api/v1/feed` (crear post) y `DELETE /api/v1/feed/{post_id}`
- [x] 5.3 `POST /api/v1/feed/{post_id}/like` y `DELETE /api/v1/feed/{post_id}/like`
- [x] 5.4 CRUD de `/api/v1/feed/{post_id}/comments`

## 6. Endpoints Ranking y Community

- [x] 6.1 `GET /api/v1/ranking`
- [x] 6.2 CRUD de `/api/v1/lost-pets`
- [x] 6.3 CRUD de `/api/v1/adoptions`

## 7. Endpoints InstaPet Social

- [x] 7.1 CRUD de `/api/v1/pets/{pet_id}/instapet/posts`
- [x] 7.2 `GET /api/v1/pets/{pet_id}/followers`, `POST` y `DELETE /api/v1/pets/{pet_id}/follow`
- [x] 7.3 `GET /api/v1/me/following`
- [x] 7.4 CRUD de `/api/v1/pets/{pet_id}/milestones`
