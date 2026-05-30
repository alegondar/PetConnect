## ADDED Requirements

### Requirement: Pet-friendly places API endpoint
The system SHALL expose a paginated REST endpoint that returns pet-friendly places with optional category filtering.

#### Scenario: List all places
- **WHEN** client sends `GET /api/v1/pet-friendly?page=1&limit=50`
- **THEN** the response contains `items` array with each place having `id`, `nombre`, `categoria`, `lat`, `lng`, `descripcion`, `foto_url`, `fuente`, `verificado`, `created_at`
- **AND** `total`, `page`, `pages` pagination metadata

#### Scenario: Filter by category
- **WHEN** client sends `GET /api/v1/pet-friendly?categoria=cafeteria`
- **THEN** the response only contains places with `categoria = 'cafeteria'`
- **AND** `total` reflects the filtered count

#### Scenario: Invalid category filter
- **WHEN** client sends `GET /api/v1/pet-friendly?categoria=invalid`
- **THEN** the system SHALL return HTTP 422 with validation error

#### Scenario: Public access
- **WHEN** client sends GET request without authentication
- **THEN** the endpoint returns data (public read via RLS)
