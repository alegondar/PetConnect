## 1. Base de datos

- [x] 1.1 Crear `docs/db_schema_petfriendly.sql` con el tipo ENUM `pet_friendly_category`, la tabla `pet_friendly_places` con todos los campos, índices en `categoria` y coordenadas, y políticas RLS (SELECT público, INSERT con WITH CHECK true)
- [x] 1.2 Ejecutar el SQL en Supabase SQL Editor para crear la tabla y las políticas

## 2. Script de importacion

- [x] 2.1 Crear `backend/scripts/import_kmz.py` que descomprima el KMZ, parsee `doc.kml` con xml.etree.ElementTree, extraiga Placemarks agrupados por Folder, y los inserte en Supabase
- [x] 2.2 Mapear nombres de Folder a categorías y extraer nombre + coordenadas de cada Placemark
- [x] 2.3 Insertar en lotes (batch de 50) con skip de duplicados (mismo nombre + lat + lng)
- [ ] 2.4 Ejecutar el script para importar los 357 lugares

## 3. Backend API

- [x] 3.1 Crear `backend/app/schemas/pet_friendly.py` con modelos Pydantic: `PetFriendlyPlaceCreate`, `PetFriendlyPlaceOut`, y `PetFriendlyPlaceList` (paginado)
- [x] 3.2 Crear `backend/app/services/pet_friendly_service.py` con funciones `list_places(page, limit, categoria)` y `create_place(data, user_id)`
- [x] 3.3 Crear `backend/app/routers/pet_friendly.py` con endpoints `GET /api/v1/pet-friendly` (paginado + filtro categoria) y `POST /api/v1/pet-friendly` (auth required)
- [x] 3.4 Registrar el router en `backend/app/main.py` con prefijo `/api/v1`

## 4. Frontend

- [x] 4.1 Crear `frontend/src/api/endpoints/petFriendly.ts` con funciones `listPlaces(params)` y `createPlace(data)`
- [x] 4.2 Crear `frontend/src/pages/PetFriendlyPage.tsx` con mapa Leaflet (centro Buenos Aires, zoom 12), markers con popup, y lista de lugares debajo
- [x] 4.3 Agregar filtro por categoría (pills: Todas, Cafeterias, Bares/Restaurantes, Hoteles, Experiencias) que filtre markers y lista
- [x] 4.4 Agregar modal/boton para agregar nuevo lugar con formulario (nombre, categoria, lat/lng via mini-mapa con pin drag, descripcion)
- [x] 4.5 Agregar ruta `/pet-friendly` en `frontend/src/App.tsx` con lazy loading y `ProtectedRoute`
- [x] 4.6 Verificar que el botón "PetFriendly" en la bottom nav (Layout.tsx) apunte a `/pet-friendly` y muestre el icono correcto

## 5. Verificacion

- [x] 5.1 Probar endpoint `GET /api/v1/pet-friendly` devuelve lugares paginados
- [x] 5.2 Probar filtro por categoria funciona
- [x] 5.3 Probar la página frontend carga el mapa con markers y popups
- [x] 5.4 Probar el formulario de agregar lugar (autenticado) crea un nuevo registro
- [x] 5.5 Ejecutar `npm run lint` en frontend sin errores
