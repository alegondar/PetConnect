## ADDED Requirements

### Requirement: Map location picker with draggable pin
The system SHALL provide an interactive map (Leaflet + OpenStreetMap) inside the "Reportar Mascota Perdida" modal that allows the user to select a location by dragging a pin. The map MUST auto-fill the `last_seen_lat` and `last_seen_lng` fields with the pin's current coordinates.

#### Scenario: User opens modal with map
- **WHEN** user opens the "Reportar Mascota Perdida" modal
- **THEN** system displays an OpenStreetMap centered on the user's current location (via browser geolocation, if granted) or a default location (-34.6037, -58.3816) with zoom level 13
- **AND** a draggable marker pin is placed at the map center
- **AND** the coordinates are displayed below the map as read-only text in the format "lat, lng"

#### Scenario: User drags pin to new location
- **WHEN** user drags the pin to a new position on the map
- **THEN** the latitude and longitude values update in real-time to reflect the pin's new position
- **AND** the read-only coordinate display below the map updates accordingly

#### Scenario: Map renders inside modal
- **WHEN** the modal opens and the map component mounts
- **THEN** the map MUST call `invalidateSize()` after render to ensure tiles display correctly
- **AND** the map height MUST be 200px within the modal container

#### Scenario: Geolocation unavailable
- **WHEN** browser geolocation is unavailable or user denies permission
- **THEN** the map MUST fall back to default center (-34.6037, -58.3816) without error
- **AND** the draggable pin is placed at the fallback center
