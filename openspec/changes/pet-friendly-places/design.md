## Context

PetConnect necesita un directorio de lugares pet-friendly en Buenos Aires. Existe un dataset colaborativo en Google My Maps mantenido por @PetFriendlyBA con 357 lugares categorizados. Este cambio crea la tabla en Supabase, importa los datos desde un archivo KMZ, expone un endpoint REST y construye una página con mapa Leaflet.

## Goals / Non-Goals

**Goals:**
- Tabla `pet_friendly_places` con categorías, coordenadas, metadata de fuente
- Script de importación desde KMZ/KML (357 lugares de Buenos Aires)
- API paginada con filtro por categoría
- Mapa Leaflet con markers y popups
- Formulario para que usuarios agreguen nuevos lugares
- RLS: lectura pública, inserción solo autenticados

**Non-Goals:**
- No se implementa edición/eliminación de lugares (solo lectura + creación)
- No se implementa sistema de reseñas ni puntuaciones
- No se importan fotos (el KMZ solo tiene nombres, categorías y coordenadas)
- No se usa Google Maps API (Leaflet + OpenStreetMap)

## Decisions

### 1. Tabla: schema mínima con fuente de datos

**Decisión:** Campos: `id` (UUID PK), `nombre`, `categoria` (enum: cafeteria/bar_restaurante/hotel/experiencia), `lat` (float8), `lng` (float8), `descripcion` (text nullable), `foto_url` (text nullable), `fuente` (text: scraping/openstreetmap/usuario), `verificado` (bool default false), `created_by` (UUID FK profiles nullable), `created_at`, `updated_at`.

**Razón:** `fuente` permite trackear la procedencia (KMZ = "openstreetmap", usuarios = "usuario"). `verificado` permite marcar lugares confirmados. `created_by` es nullable porque los lugares del KMZ no tienen autor.

### 2. Categorías como ENUM de PostgreSQL

**Decisión:** Crear tipo `pet_friendly_category` con valores: `'cafeteria'`, `'bar_restaurante'`, `'hotel'`, `'experiencia'`.

**Razón:** Valida los datos a nivel BD. Coincide con los 4 folders del KML.

### 3. Script de importación: Python puro (xml.etree.ElementTree)

**Decisión:** Script standalone `backend/scripts/import_kmz.py` que:
1. Descomprime el `.kmz` (es un ZIP con `doc.kml` adentro)
2. Parsea `doc.kml` con `xml.etree.ElementTree`
3. Itera los `<Folder>` que contienen `<Placemark>`
4. Extrae `<name>`, lat/lng de `<coordinates>`, y mapea el nombre del Folder a categoría

**Mapeo Folder → Categoría:**
- "Cafeterías" → cafeteria
- "Bares y restaurantes" → bar_restaurante
- "Hoteles" → hotel
- "Experiencias" → experiencia

**Razón:** `xml.etree.ElementTree` es stdlib. El script usa las credenciales de `.env` vía `python-dotenv` + `supabase-py`.

### 4. Endpoint API: GET /api/v1/pet-friendly

**Decisión:**
```
GET /api/v1/pet-friendly?page=1&limit=50&categoria=cafeteria
```
Respuesta:
```json
{
  "items": [{ "id", "nombre", "categoria", "lat", "lng", "descripcion", "foto_url", "fuente", "verificado", "created_at" }],
  "total": 357,
  "page": 1,
  "pages": 8
}
```

**Razón:** Estructura paginada consistente con el resto de la API (feed, pets, lost-pets).

### 5. Página frontend: mapa + lista + formulario

**Decisión:** Layout con dos secciones:
- **Mapa Leaflet** (altura ~50vh en mobile, 60vh en desktop) centrado en Buenos Aires (-34.6037, -58.3816, zoom 12)
- **Lista debajo del mapa** con cards de lugares, filtro por categoría
- **FAB o botón** para agregar nuevo lugar (abre modal con formulario: nombre, categoría, lat/lng vía mapa)
- Cada marker en el mapa muestra popup con nombre y categoría al click

**Alternativa:** Mapa a pantalla completa.  
**Razón:** La lista debajo permite buscar y filtrar lugares que no son visibles en el viewport actual del mapa.

### 6. Router FastAPI: estructura consistente

**Decisión:**
```
backend/app/
├── routers/pet_friendly.py    ← router con GET + POST
├── services/pet_friendly_service.py ← capa de servicio
└── schemas/pet_friendly.py    ← modelos Pydantic
```

**Razón:** Mismo patrón que los routers existentes (community.py, feed.py).

## Risks / Trade-offs

- **[Riesgo] El KMZ puede tener coordenadas desactualizadas** → Mitigación: campo `verificado` permite marcar lugares confirmados. Los usuarios pueden reportar datos incorrectos.
- **[Riesgo] 357 markers en Leaflet pueden ser pesados** → Mitigación: Usar `react-leaflet` con clusterización si es necesario. Para v1, 357 markers en zoom 12 de Buenos Aires es aceptable.
- **[Trade-off] Sin fotos en la importación inicial** → Aceptado: El KMZ solo tiene nombres y coordenadas. `foto_url` es nullable y se puede poblar después.
