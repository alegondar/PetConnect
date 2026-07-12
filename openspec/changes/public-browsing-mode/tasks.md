## 1. Rutas públicas en App.tsx

- [x] 1.1 Remover `<ProtectedRoute>` de `/feed` en `frontend/src/App.tsx`, dejando `<FeedPage />` directamente
- [x] 1.2 Remover `<ProtectedRoute>` de `/pet-friendly` en `frontend/src/App.tsx`, dejando `<PetFriendlyPage />` directamente
- [x] 1.3 Remover `<ProtectedRoute>` de `/lost-pets` en `frontend/src/App.tsx`, dejando `<LostPetsPage />` directamente
- [x] 1.4 Remover `<ProtectedRoute>` de `/lost-pets/:id` en `frontend/src/App.tsx`, dejando `<LostPetDetailPage />` directamente
- [x] 1.5 Remover `<ProtectedRoute>` de `/adoptions` en `frontend/src/App.tsx`, dejando `<AdoptionsPage />` directamente
- [x] 1.6 Verificar que `/my-pets`, `/settings`, `/instapet/:petId`, `/following`, `/profile/:userId`, `/search`, `/services` y rutas hijas de servicios conservan `<ProtectedRoute>`

## 2. Interceptor 401 inteligente

- [x] 2.1 Modificar el interceptor de respuesta en `frontend/src/api/client.ts`: almacenar el token leído en el request interceptor en una variable de módulo (`let hadToken = false`)
- [x] 2.2 En el interceptor de respuesta ante 401: solo limpiar `localStorage` y redirigir a `/login` si `hadToken` era `true`; si era `false`, rechazar la promesa normalmente sin limpiar ni redirigir
- [x] 2.3 Resetear `hadToken = false` al inicio de cada request en el interceptor de request (antes de leer de localStorage)

## 3. Componente LoginPromptModal

- [x] 3.1 Crear `frontend/src/components/LoginPromptModal.tsx` con props `{ open: boolean, onClose: () => void, action?: string }`
- [x] 3.2 Implementar el modal con backdrop blur (`bg-black/40 backdrop-blur-sm`), contenedor blanco redondeado (`rounded-2xl`), tipografía Fredoka para el título, y animación `animate-fade-in`, siguiendo el patrón de `FollowersModal` y `ContactServiceModal`
- [x] 3.3 Mostrar mensaje contextual: "Creá tu cuenta gratis para {action}" si `action` está definido, o un mensaje genérico si no
- [x] 3.4 Agregar botón "Crear cuenta" que navegue a `/register` y botón "Iniciar sesión" que navegue a `/login`, más botón X para cerrar

## 4. Integración de LoginPromptModal en acciones

- [x] 4.1 En `frontend/src/components/PostCard.tsx`: antes de ejecutar `likeMut.mutate()`, verificar `useAuthStore().token`. Si no hay token, abrir `LoginPromptModal` con `action="dar like"` en vez de mutar
- [x] 4.2 En `frontend/src/components/CommentSection.tsx`: antes de ejecutar `createMut.mutate()`, verificar `useAuthStore().token`. Si no hay token, abrir `LoginPromptModal` con `action="comentar"` o importarlo desde PostCard si ya está abierto
- [x] 4.3 En `frontend/src/components/FollowButton.tsx`: antes de ejecutar `usersApi.follow()`, verificar `useAuthStore().token`. Si no hay token, abrir `LoginPromptModal` con `action="seguir a esta mascota"` en vez de mutar
- [x] 4.4 En `frontend/src/components/services/ContactServiceModal.tsx`: antes de ejecutar `contactMut.mutate()`, verificar `useAuthStore().token`. Si no hay token, abrir `LoginPromptModal` con `action="contactar"` en vez de mutar
- [x] 4.5 En `frontend/src/components/CreatePostModal.tsx`: antes de ejecutar `createMut.mutate()`, verificar `useAuthStore().token`. Si no hay token, abrir `LoginPromptModal` con `action="publicar"` en vez de mutar
- [x] 4.6 En `frontend/src/components/services/CreateOfferModal.tsx` y `CreateRequestModal.tsx`: aplicar el mismo patrón con `action="publicar un servicio"` en vez de mutar

## 5. Revisión de backends (solo lectura, sin cambios)

- [x] 5.1 Revisar que `backend-node/src/routes/` (community.ts, pets.ts, instapet.ts) NO tengan authMiddleware en endpoints GET públicos de feed, lost-pets, adoptions, pet-friendly
- [x] 5.2 Si se encuentra alguna ruta GET pública con authMiddleware por error, reportarlo sin modificar (requiere confirmación)

## 6. Verificación manual

- [ ] 6.1 Navegar a `/feed`, `/pet-friendly`, `/lost-pets`, `/lost-pets/:id`, `/adoptions` sin sesión → verificar que cargan contenido (no redirigen a `/login`)
- [ ] 6.2 Intentar dar like sin sesión → verificar que se abre `LoginPromptModal` (no redirige ni recarga)
- [ ] 6.3 Intentar comentar sin sesión → verificar que se abre `LoginPromptModal`
- [ ] 6.4 Intentar seguir mascota sin sesión → verificar que se abre `LoginPromptModal`
- [ ] 6.5 Navegar a `/my-pets`, `/settings`, `/services` sin sesión → verificar que redirigen a `/login`
- [ ] 6.6 Con sesión iniciada, verificar que like, comentar, seguir, publicar y contactar servicio funcionan igual que antes (sin regresiones)
