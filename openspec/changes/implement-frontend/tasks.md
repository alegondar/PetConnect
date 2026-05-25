## 1. Setup y configuración

- [x] 1.1 Instalar dependencias (axios, react-query, zustand, react-router-dom, react-hook-form, zod)
- [x] 1.2 Actualizar `tailwind.config.js` con tokens de color PetConnect (Tailwind v4 via @theme en CSS)
- [x] 1.3 Crear estructura `frontend/src/{api,stores,hooks,types,lib}/`

## 2. Core (API client, auth store, router, layout)

- [x] 2.1 Crear `frontend/src/api/client.ts` (Axios con baseURL y JWT interceptor)
- [x] 2.2 Crear `frontend/src/api/endpoints/` con funciones por dominio (auth, pets, feed, etc.)
- [x] 2.3 Crear `frontend/src/stores/authStore.ts` (Zustand: token, profile, login, logout)
- [x] 2.4 Crear `frontend/src/components/ProtectedRoute.tsx`
- [x] 2.5 Crear `frontend/src/components/Layout.tsx` con bottom tab navigation
- [x] 2.6 Crear `frontend/src/App.tsx` con Router y lazy loading de páginas

## 3. Auth pages

- [x] 3.1 Crear `frontend/src/pages/LoginPage.tsx` (react-hook-form + zod)
- [x] 3.2 Crear `frontend/src/pages/RegisterPage.tsx` (react-hook-form + zod)

## 4. Feed pages

- [x] 4.1 Crear `frontend/src/pages/FeedPage.tsx` (lista de posts con React Query)
- [x] 4.2 Crear `frontend/src/components/PostCard.tsx` (post con like, comentarios, autor)
- [x] 4.3 Crear `frontend/src/components/CreatePostModal.tsx`
- [x] 4.4 Crear `frontend/src/components/CommentSection.tsx`

## 5. Pets pages

- [x] 5.1 Crear `frontend/src/pages/MyPetsPage.tsx` (lista de mascotas del usuario)
- [x] 5.2 Crear `frontend/src/pages/PetDetailPage.tsx` (vet visits + health events)
- [x] 5.3 Crear `frontend/src/components/PetCard.tsx` (included in MyPetsPage)
- [x] 5.4 Crear `frontend/src/components/PetForm.tsx` (included in MyPetsPage)

## 6. InstaPet pages

- [x] 6.1 Crear `frontend/src/pages/InstaPetPage.tsx` (perfil social de mascota)
- [x] 6.2 Crear `frontend/src/components/InstaPetPostGrid.tsx` (included in InstaPetPage)
- [x] 6.3 Crear `frontend/src/components/MilestoneTimeline.tsx` (included in InstaPetPage)
- [x] 6.4 Crear `frontend/src/pages/FollowingPage.tsx`

## 7. Ranking page

- [x] 7.1 Crear `frontend/src/pages/RankingPage.tsx` (top mascotas de la semana)

## 8. Community pages

- [x] 8.1 Crear `frontend/src/pages/LostPetsPage.tsx` (lista + filtro + reporte)
- [x] 8.2 Crear `frontend/src/pages/AdoptionsPage.tsx` (lista + publicar)
- [x] 8.3 Crear `frontend/src/components/LostPetCard.tsx` (included in LostPetsPage)
- [x] 8.4 Crear `frontend/src/components/AdoptionCard.tsx` (included in AdoptionsPage)
