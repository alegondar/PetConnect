## 1. Core (config, Supabase, middlewares)

- [x] 1.1 Actualizar `backend/requirements.txt` (supabase, python-jose, httpx)
- [x] 1.2 Crear `backend/app/config.py` con variables de entorno (SUPABASE_URL, SUPABASE_SERVICE_KEY, etc.)
- [x] 1.3 Crear `backend/app/core/supabase.py` con cliente singleton y helpers
- [x] 1.4 Crear `backend/app/core/auth.py` con dependencia `get_current_user` (validación JWT)
- [x] 1.5 Crear `backend/app/core/pagination.py` con helper de paginación genérico
- [x] 1.6 Actualizar `backend/app/main.py` con CORS, routers y startup

## 2. Schemas Pydantic

- [x] 2.1 Crear `backend/app/schemas/auth.py` (RegisterRequest, LoginRequest, AuthResponse, UpdateProfileRequest)
- [x] 2.2 Crear `backend/app/schemas/profile.py` (Profile)
- [x] 2.3 Crear `backend/app/schemas/pet.py` (Pet, CreatePetRequest, UpdatePetRequest, PetEvent, VetVisit y requests)
- [x] 2.4 Crear `backend/app/schemas/social.py` (Post, PostDetail, Like, Comment y requests)
- [x] 2.5 Crear `backend/app/schemas/community.py` (LostPet, Adoption y requests)
- [x] 2.6 Crear `backend/app/schemas/instapet.py` (InstaPetPost, InstaPetFollower, InstaPetMilestone y requests)
- [x] 2.7 Crear `backend/app/schemas/ranking.py` (RankingEntry)
- [x] 2.8 Crear `backend/app/schemas/common.py` (ErrorResponse, PaginatedResponse)

## 3. Services

- [x] 3.1 Crear `backend/app/services/auth_service.py` (register, login, get_profile, update_profile)
- [x] 3.2 Crear `backend/app/services/pet_service.py` (CRUD pets, vet_visits, pet_events)
- [x] 3.3 Crear `backend/app/services/social_service.py` (CRUD posts, likes, comments con counters)
- [x] 3.4 Crear `backend/app/services/community_service.py` (CRUD lost_pets, adoptions)
- [x] 3.5 Crear `backend/app/services/instapet_service.py` (CRUD instapet_posts, followers, milestones)
- [x] 3.6 Crear `backend/app/services/ranking_service.py` (query weekly_ranking)

## 4. Routers (7 módulos)

- [x] 4.1 Crear `backend/app/routers/auth.py` (register, login, me)
- [x] 4.2 Crear `backend/app/routers/pets.py` (CRUD pets + vet-visits + events)
- [x] 4.3 Crear `backend/app/routers/social.py` (feed, posts, likes, comments)
- [x] 4.4 Crear `backend/app/routers/ranking.py` (GET ranking)
- [x] 4.5 Crear `backend/app/routers/community.py` (lost-pets, adoptions)
- [x] 4.6 Crear `backend/app/routers/instapet.py` (instapet posts, followers, milestones)
