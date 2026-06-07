## ADDED Requirements

### Requirement: Mapa de veterinarias 24hs visible en /services
El sistema DEBE mostrar un mapa interactivo con la ubicación de todas las veterinarias de guardia 24 horas de CABA y GBA cuando el usuario selecciona el filtro "Veterinario" en la sección de servicios.

#### Scenario: Usuario ve el mapa al filtrar por veterinario
- **WHEN** el usuario navega a `/services`, selecciona la pestaña "Ofrezco servicio" y elige el filtro "Veterinario"
- **THEN** el sistema muestra un mapa Leaflet centrado en Buenos Aires con marcadores de todas las veterinarias 24hs cargadas

#### Scenario: Mapa visible sin autenticación
- **WHEN** un usuario no autenticado visita `/services` y aplica el filtro "Veterinario"
- **THEN** el mapa se renderiza normalmente con todos los marcadores, sin requerir login

### Requirement: Filtro por zona en el mapa
El sistema DEBE permitir filtrar las veterinarias visibles en el mapa por zona geográfica (CABA o GBA) mediante botones de filtro.

#### Scenario: Usuario filtra solo veterinarias de CABA
- **WHEN** el usuario hace clic en el botón "CABA" en el componente del mapa
- **THEN** solo se muestran los marcadores cuya `zona` es "CABA" y los demás se ocultan

#### Scenario: Usuario filtra solo veterinarias de GBA
- **WHEN** el usuario hace clic en el botón "GBA" en el componente del mapa
- **THEN** solo se muestran los marcadores cuya `zona` es "GBA" y los demás se ocultan

#### Scenario: Usuario vuelve a ver todas las zonas
- **WHEN** el usuario hace clic en el botón "Todos" estando aplicado un filtro de zona
- **THEN** se muestran nuevamente todos los marcadores sin distinción de zona

### Requirement: Popup informativo al clickear un marcador
El sistema DEBE mostrar un popup con información detallada de la veterinaria cuando el usuario hace clic en su marcador del mapa.

#### Scenario: Usuario hace clic en un marcador
- **WHEN** el usuario hace clic en el marcador de una veterinaria en el mapa
- **THEN** se abre un popup que muestra el nombre, dirección, teléfono y zona de la veterinaria

#### Scenario: Popup muestra teléfono solo si está disponible
- **WHEN** el usuario hace clic en un marcador cuya veterinaria no tiene teléfono registrado
- **THEN** el popup muestra nombre, dirección y zona, pero omite el campo de teléfono

### Requirement: Endpoint GET /api/v1/veterinarias
El sistema DEBE exponer un endpoint público que retorne el listado completo de veterinarias 24hs, con filtro opcional por zona.

#### Scenario: Obtener todas las veterinarias
- **WHEN** se hace una solicitud `GET /api/v1/veterinarias` sin parámetros
- **THEN** el sistema retorna un array JSON con todos los registros de la tabla `veterinarias_24hs`, ordenados alfabéticamente por nombre

#### Scenario: Filtrar por zona CABA
- **WHEN** se hace una solicitud `GET /api/v1/veterinarias?zona=CABA`
- **THEN** el sistema retorna únicamente los registros cuya `zona` es "CABA"

#### Scenario: Filtrar por zona GBA
- **WHEN** se hace una solicitud `GET /api/v1/veterinarias?zona=GBA`
- **THEN** el sistema retorna únicamente los registros cuya `zona` es "GBA"

#### Scenario: Zona inválida
- **WHEN** se hace una solicitud `GET /api/v1/veterinarias?zona=INVALIDO`
- **THEN** el sistema retorna un array vacío (sin error)

### Requirement: Tabla veterinarias_24hs en la base de datos
El sistema DEBE contar con una tabla `veterinarias_24hs` en Supabase que almacene los datos institucionales de las clínicas veterinarias de guardia.

#### Scenario: Estructura de la tabla
- **WHEN** se ejecuta la migración SQL
- **THEN** la tabla `veterinarias_24hs` existe con columnas: `id` (uuid PK), `nombre` (text NOT NULL), `direccion` (text), `telefono` (text), `zona` (text), `lat` (float8 NOT NULL), `lng` (float8 NOT NULL), `descripcion` (text), `verified` (boolean DEFAULT true), `created_at` (timestamptz DEFAULT now())

#### Scenario: Lectura pública habilitada
- **WHEN** un cliente anónimo consulta la tabla `veterinarias_24hs`
- **THEN** la consulta SELECT retorna los registros sin error (RLS permite lectura pública)

### Requirement: Script de importación desde KMZ
El sistema DEBE incluir un script que procese el archivo `docs/Veterinarias 24hs CABA y GBA.kmz` e inserte los datos en la tabla `veterinarias_24hs`.

#### Scenario: Importación exitosa del KMZ
- **WHEN** se ejecuta `npx tsx backend-node/scripts/import-veterinarias.ts`
- **THEN** el script descomprime el KMZ, extrae `doc.kml`, parsea cada `<Placemark>`, detecta la zona (CABA/GBA) e inserta los registros en Supabase

#### Scenario: Coordenadas en orden correcto
- **WHEN** el script parsea un `<Point><coordinates>` del KML con valor `-58.45,-34.60,0`
- **THEN** el registro insertado tiene `lat = -34.60` y `lng = -58.45` (el script invierte el orden lng,lat del KML a lat,lng de la BD)
