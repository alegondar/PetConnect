## ADDED Requirements

### Requirement: Pet-friendly map page
The system SHALL provide a frontend page at `/pet-friendly` displaying a Leaflet map with markers for all pet-friendly places, a filterable list, and a form to add new places.

#### Scenario: Map loads with markers
- **WHEN** user navigates to `/pet-friendly`
- **THEN** a Leaflet map renders centered on Buenos Aires (-34.6037, -58.3816) at zoom 12
- **AND** markers appear for all pet-friendly places fetched from the API
- **AND** each marker popup shows the place name and category on click

#### Scenario: Category filter
- **WHEN** user selects a category filter (cafeteria, bar_restaurante, hotel, experiencia)
- **THEN** both the map markers and the list below update to show only matching places

#### Scenario: Add new place (authenticated)
- **WHEN** authenticated user clicks "Agregar lugar"
- **THEN** a modal opens with form fields: nombre, categoria (select), lat/lng (via mini-map pin drag), descripcion, foto_url
- **AND** on submit, the place is inserted via POST to the backend
- **AND** the map refreshes to show the new marker

#### Scenario: Add new place (unauthenticated)
- **WHEN** unauthenticated user clicks "Agregar lugar"
- **THEN** they are redirected to `/login`

#### Scenario: Place list below map
- **WHEN** the page loads
- **THEN** a scrollable list of place cards appears below the map
- **AND** each card shows nombre, categoria (as badge), and coordinates
