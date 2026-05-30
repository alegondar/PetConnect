## Why

PetConnect no tiene un directorio de lugares pet-friendly. Los dueños de mascotas en Buenos Aires necesitan saber qué cafeterías, bares, hoteles y experiencias aceptan animales. Existe un dataset público de 357 lugares ("Mapa Dog Friendly Buenos Aires - Pet Friendly BA") en el Google My Maps de @PetFriendlyBA. Importarlo y exponerlo en la app agrega valor inmediato a los usuarios y cumple la sección "PetFriendly" del bottom nav.

## What Changes

- Nueva tabla `pet_friendly_places` en Supabase con categorías (cafeteria, bar_restaurante, hotel, experiencia), coordenadas, descripción, foto y metadata de fuente
- Script Python `backend/scripts/import_kmz.py` que parsea el archivo KMZ/KML del mapa colaborativo e inserta los 357 lugares en Supabase
- Endpoint `GET /api/v1/pet-friendly` paginado con filtro por `categoria`
- Página `frontend/src/pages/PetFriendlyPage.tsx` con mapa Leaflet de Buenos Aires, markers por lugar, popup con nombre/categoría al click
- Botón en la página para que usuarios autenticados agreguen nuevos lugares (INSERT con `created_by`)
- Ruta `/pet-friendly` en el router con lazy loading

## Capabilities

### New Capabilities

- `pet-friendly-db`: Tabla `pet_friendly_places` con schema, índices y políticas RLS
- `import-kmz`: Script de importación del dataset KMZ/KML a Supabase
- `pet-friendly-api`: Endpoint REST paginado con filtro por categoría
- `pet-friendly-map`: Página frontend con mapa Leaflet, markers interactivos y formulario de alta

### Modified Capabilities

(Ninguna — funcionalidad nueva, no modifica endpoints existentes)

## Impact

- `docs/db_schema_petfriendly.sql` — Nuevo archivo de schema
- `backend/scripts/import_kmz.py` — Nuevo script de importación
- `backend/app/routers/pet_friendly.py` — Nuevo router FastAPI
- `backend/app/services/pet_friendly_service.py` — Nueva capa de servicio
- `backend/app/main.py` — Registrar nuevo router
- `frontend/src/pages/PetFriendlyPage.tsx` — Nueva página con mapa
- `frontend/src/App.tsx` — Agregar ruta `/pet-friendly`
- `frontend/src/components/Layout.tsx` — El botón "PetFriendly" ya existe en la nav (se renombró de "Ranking")
- `docs/Mapa_Dog_Friendly_Buenos_Aires_-_Pet_Friendly_BA.kmz` — Archivo de datos fuente (debe descargarse del Google My Maps de @PetFriendlyBA)
