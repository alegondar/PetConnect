## Context

PetConnect ya tiene un mapa funcional en `/pet-friendly` que muestra lugares pet-friendly usando react-leaflet con OpenStreetMap tiles. El patrón está probado: `MapContainer` + `TileLayer` + `Marker` con `Popup`, centrado en Buenos Aires (`[-34.6037, -58.3816]`), con `scrollWheelZoom={false}` para evitar conflictos de scroll en mobile.

El proyecto cuenta con un archivo KMZ (`docs/Veterinarias 24hs CABA y GBA.kmz`) que contiene datos institucionales de clínicas veterinarias de guardia. Se requiere exponer estos datos en un mapa similar dentro de `/services`, en la sección de tipo `veterinario`.

Los datos son estáticos e institucionales (no generados por usuarios), por lo que no requieren paginación ni endpoints de escritura públicos. La importación se hace una sola vez vía script administrativo.

## Goals / Non-Goals

**Goals:**
- Procesar el KMZ existente y poblar una tabla `veterinarias_24hs` en Supabase
- Exponer los datos vía `GET /api/v1/veterinarias` con filtro opcional por zona
- Mostrar un mapa interactivo en `/services` con marcadores, popups y filtro CABA/GBA
- Reutilizar el patrón visual y técnico del mapa de `/pet-friendly`

**Non-Goals:**
- CRUD de veterinarias desde el frontend (no se crean, editan ni eliminan)
- Autenticación en el endpoint GET (datos públicos)
- Búsqueda por texto o geocodificación inversa
- Paginación (~200 registros, se envían todos)
- Sincronización bidireccional con el KMZ (importación one-shot)

## Decisions

### 1. Tabla separada `veterinarias_24hs` (no reutilizar `service_offers`)
**Alternativa**: Usar `service_offers` con `service_type = 'veterinario'`.
**Decisión**: Tabla dedicada.
**Razón**: `service_offers` guarda perfiles de usuarios con `provider_id`, precios, disponibilidad. Las veterinarias 24hs son datos institucionales sin dueño, con campos distintos (zona, verified). Mezclarlos complica queries, RLS y la semántica del dominio.

### 2. Endpoint sin autenticación
**Alternativa**: Proteger con `authMiddleware` como los demás endpoints.
**Decisión**: GET público sin auth.
**Razón**: Son datos institucionales de interés público. No exponen información de usuarios. El mapa debe ser visible incluso para usuarios no logueados que visiten `/services`.

### 3. Sin paginación
**Alternativa**: Paginar con `page`/`limit` como en `/pet-friendly`.
**Decisión**: Retornar todos los registros de una vez.
**Razón**: Son ~200 registros máximo. La paginación añade complejidad innecesaria en frontend (el mapa necesita todos los marcadores de una vez). El payload es pequeño (~20 KB).

### 4. Script de importación con `jszip` + `fast-xml-parser`
**Alternativa**: Usar `adm-zip` + `xml2js`, o un parser SAX.
**Decisión**: `jszip` + `fast-xml-parser`.
**Razón**: `jszip` es la librería más mantenida para ZIP en Node. `fast-xml-parser` es rápido, ligero y no requiere configuración compleja. Ambos ya se usan en ecosistemas similares.

### 5. Componente `VeterinariasMap` standalone, integrado condicionalmente en `ServicesPage`
**Alternativa**: Modificar `ServicesPage` inline para agregar el mapa.
**Decisión**: Componente separado `VeterinariasMap.tsx`, renderizado cuando `typeFilter === 'veterinario'` en la tab de ofertas.
**Razón**: Mantiene `ServicesPage` enfocado en el marketplace. El componente puede reutilizarse si se necesita en otra página. Sigue el patrón de componentes existentes (`MapLocationPicker`, modales en `services/`).

### 6. Ícono personalizado para marcadores
**Alternativa**: Usar el marcador default de Leaflet.
**Decisión**: Ícono rojo personalizado (cruz médica o pata) vía `L.Icon` con URL a un SVG/PNG.
**Razón**: Diferenciación visual inmediata de los marcadores de servicios y pet-friendly. Consistencia con el diseño general de PetConnect.

## Risks / Trade-offs

- **[KMZ malformado]** El script puede fallar si el XML del KML tiene estructura inesperada → Mitigación: validar cada `<Placemark>`, loguear warnings y continuar con los que sí parsean.
- **[Coordenadas invertidas]** KML usa `lng,lat,alt` pero Leaflet espera `[lat, lng]` → Mitigación: documentar la inversión en el script con comentarios visibles.
- **[Datos duplicados en re-importación]** Si el script se corre dos veces, se duplican registros → Mitigación: truncar la tabla antes de importar o usar `ON CONFLICT` con un constraint de unicidad.
- **[Rendimiento del mapa con 200 markers]** Leaflet maneja bien 200 markers sin clustering, pero en dispositivos lentos puede haber lag → Mitigación: si se detecta lentitud, agregar `react-leaflet-cluster` en iteración futura (non-goal inicial).
- **[Dependencia de CDN para tiles]** OpenStreetMap tiles se cargan desde CDN externa → Mitigación: igual que en `/pet-friendly`, es aceptable. Sin conexión el mapa no carga, pero la app sigue funcionando.

## Migration Plan

1. Ejecutar migración SQL en Supabase (crea tabla + RLS)
2. Instalar dependencias `jszip` + `fast-xml-parser` en backend-node
3. Ejecutar script de importación: `npx tsx backend-node/scripts/import-veterinarias.ts`
4. Desplegar backend con nueva ruta
5. Desplegar frontend con nuevo componente
6. Rollback: eliminar ruta del router, eliminar componente del JSX, la tabla puede quedar (no afecta)

## Open Questions

- ¿El KMZ contiene todas las veterinarias 24hs o solo una selección? (asumimos que es la fuente completa)
- ¿Se necesitará actualizar el KMZ periódicamente? Si es así, el script debe soportar re-importación sin duplicados.
