## Why

PetConnect carece de un directorio geolocalizado de veterinarias de guardia 24 horas. Los usuarios que necesitan atención urgente para sus mascotas en CABA o GBA no tienen forma de encontrar la clínica más cercana desde la app. Integrar los datos institucionales del KMZ existente cubre esta necesidad sin depender de contenido generado por usuarios.

## What Changes

- Nueva tabla `veterinarias_24hs` en Supabase con datos institucionales de clínicas 24hs
- Script de importación que procesa el archivo KMZ y carga los registros en la base de datos
- Endpoint `GET /api/v1/veterinarias` con filtro opcional por zona (CABA/GBA)
- Componente `VeterinariasMap` con mapa Leaflet, marcadores, popups informativos y filtro por zona
- Integración del mapa en la sección `/services`, accesible desde la pestaña de tipo `veterinario`
- Función cliente en `frontend/src/api/endpoints/` para consumir el endpoint

## Capabilities

### New Capabilities
- `veterinarias-24hs`: Mapa interactivo de veterinarias de guardia 24 horas en CABA y GBA, con datos importados desde fuente institucional (KMZ), filtro por zona y popups con información de contacto.

### Modified Capabilities
<!-- None -->

## Impact

- **Database**: Nueva tabla `veterinarias_24hs` con RLS habilitada
- **Backend**: Nuevo archivo de rutas `backend-node/src/routes/veterinarias.ts` y script `backend-node/scripts/import-veterinarias.ts`
- **Frontend**: Nuevo componente `VeterinariasMap.tsx`, modificación de `ServicesPage.tsx` para integrarlo, nueva función en `frontend/src/api/endpoints/`
- **Dependencias**: `jszip` y `fast-xml-parser` en backend-node (solo para el script de importación)
- **Documentación**: Actualización de `docs/openapi.yaml` y `README.md`
