## Context

El formulario "Reportar Mascota Perdida" en `LostPetsPage.tsx` tiene un componente `LostPetForm` con inputs manuales de latitud, longitud y URL de foto. El objetivo es reemplazar lat/lng por un mapa interactivo y el input de URL por un upload de archivo real. El backend y los endpoints no cambian.

## Goals / Non-Goals

**Goals:**
- Mapa interactivo con pin arrastrable que auto-completa lat/lng
- Upload de foto con previsualización y subida a Supabase Storage
- Mantener compatibilidad con el endpoint `POST /api/v1/community/lost-pets` existente
- Reutilizar el patrón de upload de `MyPetsPage` (File → FormData → `/pets/upload-photo` → URL)

**Non-Goals:**
- No se modifica la API del backend
- No se añade geocodificación inversa (mostrar dirección desde lat/lng)
- No se implementa búsqueda de direcciones en el mapa (solo pin drag)
- No se migra a react-hook-form (se mantiene useState, consistente con el resto del proyecto)

## Decisions

### 1. Librería de mapa: Leaflet + react-leaflet

**Decisión:** Usar `leaflet` + `react-leaflet` + `@types/leaflet` con tiles de OpenStreetMap (gratis, sin API key).

**Alternativas consideradas:**
- Google Maps API: Requiere API key, billing account, y tiene costos. Overkill para un pin simple.
- Mapbox GL JS: Requiere token. Mismo problema de costo.
- Leaflet: Open source, sin API key, tiles OpenStreetMap gratuitos, bundle pequeño (~40KB gzip). Comunidad masiva.

**Razón:** Leaflet es la opción más ligera, gratuita y sin fricción. Para un solo marcador arrastrable no necesitamos features avanzadas.

### 2. Componente map vs inline en el modal

**Decisión:** Crear un componente `<MapLocationPicker />` separado que recibe lat/lng iniciales y emite cambios vía callback `onLocationChange(lat, lng)`. Se renderiza dentro del modal existente de LostPetForm.

```
LostPetsPage
  └── Modal (fixed inset-0, bg-black/40 backdrop-blur-sm)
       └── LostPetForm
            ├── <input name="Nombre">
            ├── <input name="Especie">
            ├── <MapLocationPicker />      ← NUEVO: reemplaza lat/lng inputs
            ├── <input label="Última ubicación" (solo texto informativo)>
            ├── <PhotoUploadField />        ← NUEVO: reemplaza URL input
            ├── <textarea name="Descripción">
            └── <button Cancelar / Reportar>
```

**Razón:** Componentes separados permiten reutilizar `MapLocationPicker` en otras pantallas (ej: definir zona de búsqueda en Adopciones). `PhotoUploadField` ya tiene un patrón existente en `MyPetsPage` que podemos extraer.

### 3. Valores iniciales del mapa

**Decisión:** Centrar el mapa en lat/lng por defecto si el usuario no tiene ubicación previa. Por defecto: centro de Buenos Aires (-34.6037, -58.3816) con zoom 13 (nivel barrio). El pin empieza en el centro y el usuario lo arrastra.

Alternativa: Usar `navigator.geolocation` para centrar en la ubicación real del usuario.

**Razón:** `navigator.geolocation` requiere permiso del navegador y puede fallar. Usar un centro por defecto + zoom permite al usuario buscar visualmente su ubicación. Si geolocation está disponible y el usuario acepta, centramos ahí.

### 4. Upload de foto: reutilizar patrón existente

**Decisión:** El upload usa el mismo flujo que `MyPetsPage` y `PostCard`:
1. Input `type="file"` oculto + botón visual que lo dispara
2. Previsualización con `URL.createObjectURL(file)`
3. Al submit: `FormData` con el archivo → `POST /api/v1/pets/upload-photo` → URL retornada
4. La URL se incluye en `photo_url` del payload del create

**Alternativa:** Subir directo a Supabase Storage desde el frontend (sin pasar por el backend).

**Razón:** El endpoint `/api/v1/pets/upload-photo` ya existe, maneja autenticación, y genera URLs públicas consistentes. Subir directo desde el frontend requeriría exponer la key de Supabase y manejar políticas de storage.

### 5. Layout del modal con mapa

**Decisión:** El mapa ocupa ~200px de alto dentro del modal, arriba del todo. Debajo, el campo "Última ubicación" es solo texto informativo (lat, lng) en gris, no editable. El upload de foto va en la misma posición que antes pero como file input + preview.

```
┌──────────────────────────────────┐
│       Reportar Mascota Perdida   │
│                                  │
│  ┌────────────────────────────┐  │
│  │                            │  │
│  │     [MAPA LEAFTLET]        │  │
│  │        📍 pin              │  │
│  │     200px height           │  │
│  │                            │  │
│  └────────────────────────────┘  │
│  📍 -34.6037, -58.3816 (gris)   │
│                                  │
│  Nombre *         [________]     │
│  Especie *        [________]     │
│                                  │
│  ┌────────────────────────────┐  │
│  │   📷 Seleccionar foto      │  │
│  │   (o previsualización)     │  │
│  └────────────────────────────┘  │
│                                  │
│  Descripción      [________]     │
│                                  │
│         [Cancelar] [Reportar]    │
└──────────────────────────────────┘
```

## Risks / Trade-offs

- **[Riesgo] Leaflet CSS puede tener conflictos con Tailwind** → Mitigación: Importar `leaflet/dist/leaflet.css` en `index.css` y usar un contenedor con altura fija. Los estilos de Leaflet usan clases específicas (`.leaflet-*`) que no colisionan con Tailwind.
- **[Riesgo] El mapa se renderiza antes de que el modal esté completamente montado** → Mitigación: Usar `useEffect` + `map.invalidateSize()` cuando el modal se abre para recalcular dimensiones.
- **[Riesgo] El modal con mapa puede ser pesado en mobile** → Mitigación: Altura del mapa limitada a 200px. No cargar tiles de zoom profundo innecesarios (maxZoom: 18).
- **[Trade-off] Leaflet añade ~40KB al bundle** → Aceptado: La mejora de UX (seleccionar ubicación visualmente vs escribir coordenadas) justifica el peso. Se puede lazy-loadear el componente del mapa con `React.lazy()`.

## Migration Plan

1. Instalar dependencias: `leaflet`, `react-leaflet`, `@types/leaflet`
2. Importar CSS de Leaflet en `index.css`
3. Crear `MapLocationPicker.tsx` en `components/`
4. Crear `PhotoUploadField.tsx` (o inline en LostPetForm)
5. Reescribir `LostPetForm` en `LostPetsPage.tsx`
6. Probar: abrir modal, arrastrar pin, seleccionar foto, submit → verificar que lat/lng y photo_url llegan al backend

Rollback: revertir `LostPetsPage.tsx` y eliminar los 2 componentes nuevos. Las dependencias de Leaflet pueden quedarse instaladas (no afectan si no se usan).

## Open Questions

- ¿El mapa debería mostrar la ubicación actual del usuario como punto de partida? → Sí, usar `navigator.geolocation` si está disponible, con fallback a Buenos Aires.
