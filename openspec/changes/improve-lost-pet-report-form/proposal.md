## Why

El formulario "Reportar Mascota Perdida" (`/lost-pets`) actualmente pide coordenadas manuales (latitud/longitud) y una URL de foto como texto plano. Esto es poco usable: el usuario no sabe sus coordenadas y tiene que hostear la foto en otro lado antes de pegarla. Mejorar la UX con un selector de mapa y un upload de archivo reduce la fricción y aumenta los reportes.

## What Changes

- Reemplazar los campos Latitud y Longitud por un solo campo "Última ubicación" que abra un mapa interactivo (Leaflet/OpenStreetMap) para que el usuario seleccione visualmente el punto
- Reemplazar el input de "URL de foto" por un upload de archivo con previsualización (idéntico al que ya existe en MyPetsPage y PostCard)
- La foto se sube al bucket `pets` de Supabase Storage (endpoint `/api/v1/pets/upload-photo` ya existente)
- Los campos de lat/lng se siguen enviando al backend, pero ahora se obtienen del mapa en lugar de input manual

## Capabilities

### New Capabilities

- `map-location-picker`: Componente que renderiza un mapa interactivo (Leaflet + OpenStreetMap) dentro del modal de reporte, permitiendo al usuario marcar/arrastrar un pin para seleccionar coordenadas
- `file-photo-upload-field`: Campo de upload de foto con previsualización y subida automática a Supabase Storage, reutilizable en formularios

### Modified Capabilities

(Ninguna — los endpoints del backend no cambian, solo cambia cómo el frontend recolecta los datos)

## Impact

- `frontend/src/pages/LostPetsPage.tsx` — Reescritura del componente `LostPetForm` (lat/lng + url → map picker + file upload)
- `frontend/package.json` — Nueva dependencia: `leaflet` + `@types/leaflet` + `react-leaflet` (o alternativamente `@react-google-maps/api`)
- No afecta al backend ni la API (se siguen usando los mismos endpoints y campos)
