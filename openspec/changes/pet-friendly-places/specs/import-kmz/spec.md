## ADDED Requirements

### Requirement: KMZ/KML import script
The system SHALL provide a Python script that parses the KMZ file from `docs/Mapa_Dog_Friendly_Buenos_Aires_-_Pet_Friendly_BA.kmz` and inserts all Placemark entries into the `pet_friendly_places` table in Supabase.

#### Scenario: KMZ extraction
- **WHEN** the script runs and finds the `.kmz` file at `docs/Mapa_Dog_Friendly_Buenos_Aires_-_Pet_Friendly_BA.kmz`
- **THEN** it unzips the file (KMZ is a ZIP container) to extract `doc.kml`
- **AND** parses the XML with `xml.etree.ElementTree`

#### Scenario: Placemark parsing by folder
- **WHEN** the KML contains `<Folder>` elements with `<name>` and `<Placemark>` children
- **THEN** the script maps each Folder to a category: "Cafeterias" → cafeteria, "Bares y restaurantes" → bar_restaurante, "Hoteles" → hotel, "Experiencias" → experiencia
- **AND** extracts each Placemark's `<name>` and `<coordinates>` (lng,lat,0)

#### Scenario: Supabase insert
- **WHEN** all Placemarks are parsed
- **THEN** the script inserts each one into `pet_friendly_places` with `fuente = 'openstreetmap'` and `verificado = false`
- **AND** skips duplicates (same nombre + lat + lng) to allow re-runs
- **AND** uses credentials from `backend/.env` (SUPABASE_URL, SUPABASE_SERVICE_KEY)

#### Scenario: Missing KMZ file
- **WHEN** the KMZ file is not found at the expected path
- **THEN** the script prints an error message and exits with code 1
