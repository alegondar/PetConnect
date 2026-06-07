## 1. Base de datos

- [x] 1.1 Crear migración SQL `migrations/001_veterinarias_24hs.sql` con la tabla `veterinarias_24hs`, índices y políticas RLS (lectura pública, inserción con service key)
- [x] 1.2 Ejecutar la migración en Supabase y verificar que la tabla existe con `SELECT` de prueba

## 2. Backend — Script de importación

- [x] 2.1 Instalar dependencias: `pnpm --filter petconnect-backend add jszip fast-xml-parser` y `pnpm --filter petconnect-backend add -D @types/jszip`
- [x] 2.2 Crear `backend-node/scripts/import-veterinarias.ts` que descomprima el KMZ con jszip, extraiga `doc.kml`, parsee los `<Placemark>` con fast-xml-parser e inserte los registros en `veterinarias_24hs` via Supabase service role
- [x] 2.3 Ejecutar el script con `npx tsx backend-node/scripts/import-veterinarias.ts` y verificar que los registros se cargan correctamente

## 3. Backend — Endpoint API

- [x] 3.1 Crear `backend-node/src/routes/veterinarias.ts` con `GET /api/v1/veterinarias`, query param `zona` opcional, sin auth, ordenado por nombre
- [x] 3.2 Registrar la ruta en `backend-node/src/index.ts` (import + `app.route`)
- [x] 3.3 Probar el endpoint con curl: `GET /api/v1/veterinarias` y `GET /api/v1/veterinarias?zona=CABA`

## 4. Frontend — Cliente API

- [x] 4.1 Crear `frontend/src/api/endpoints/veterinarias.ts` con función `getVeterinarias(zona?: string)` que llame a `GET /api/v1/veterinarias`
- [x] 4.2 Exportar la función desde `frontend/src/api/endpoints/index.ts` (si aplica) o usarla directamente desde el componente

## 5. Frontend — Componente VeterinariasMap

- [x] 5.1 Crear `frontend/src/components/VeterinariasMap.tsx` con mapa Leaflet (MapContainer + TileLayer + Marker + Popup), centrado en Buenos Aires, altura mínima 400px
- [x] 5.2 Agregar ícono personalizado para marcadores (cruz roja/ícono médico vía L.Icon con URL a imagen)
- [x] 5.3 Agregar popups con nombre, dirección, teléfono y zona al hacer clic en un marcador
- [x] 5.4 Agregar botones de filtro "Todos | CABA | GBA" que filtran los marcadores sin recargar la página
- [x] 5.5 Usar `@tanstack/react-query` para obtener los datos del endpoint al montar el componente

## 6. Frontend — Integración en ServicesPage

- [x] 6.1 En `ServicesPage.tsx`, cuando `typeFilter === 'veterinario'` y `tab === 'offers'`, renderizar `<VeterinariasMap />` debajo del contenido de ofertas
- [x] 6.2 Verificar que el mapa se oculta al cambiar a otro filtro o pestaña

## 7. Documentación

- [x] 7.1 Actualizar `docs/openapi.yaml` agregando el path `GET /api/v1/veterinarias` con sus parámetros y respuesta
- [x] 7.2 Agregar fila en `README.md` en la tabla de módulos: `🏥 Veterinarias 24hs | Mapa de veterinarias 24hs de CABA y GBA importadas desde KMZ`

## 8. Verificación

- [x] 8.1 Verificar que la migración SQL corre sin errores
- [x] 8.2 Verificar que `GET /api/v1/veterinarias` retorna datos correctos
- [x] 8.3 Verificar que el mapa se renderiza en `/services` con el filtro veterinario
- [x] 8.4 Verificar que los popups muestran nombre, dirección, teléfono y zona
- [x] 8.5 Verificar que el filtro CABA/GBA funciona sin recargar la página
- [x] 8.6 Verificar consistencia visual con el mapa de `/pet-friendly`
