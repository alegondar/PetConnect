## Why

El backend FastAPI ya está implementado siguiendo `docs/openapi.yaml`. El frontend React es la cara visible de PetConnect y debe consumir esa API respetando el contrato, la guía de estilo del diseñador y el enfoque mobile-first.

## What Changes

- Instalar dependencias frontend adicionales (react-query, zustand, react-router, axios, react-hook-form, zod)
- Crear estructura `frontend/src/{pages,components,api,stores,hooks,types,lib}/`
- Implementar API client con Axios e interceptores de auth
- Implementar ~8 páginas con sus componentes
- Zustand store para auth y estado global
- Tailwind config con los tokens de color del diseñador

## Capabilities

### New Capabilities
- `frontend-core`: Setup de la app, Router con lazy loading, Layout con navegación, API client con Axios, Zustand auth store, configuración de Tailwind
- `frontend-auth`: Páginas de Login y Register con react-hook-form + zod
- `frontend-feed`: FeedPage con lista de posts, likes, comentarios, creación de post
- `frontend-pets`: MyPetsPage con CRUD de mascotas, visitas al veterinario y eventos health
- `frontend-instapet`: InstaPetPage con posts del perfil de mascota, followers, milestones
- `frontend-ranking`: RankingPage con top semanal de mascotas
- `frontend-community`: LostPetsPage y AdoptionsPage con filtros y geolocalización

## Impact

- Modifica `frontend/` (package.json, tailwind.config, src/)
- Instala ~6 nuevas dependencias npm
- Crea ~20 archivos nuevos en `frontend/src/`
- Sin impacto en backend ni docs
