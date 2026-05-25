## ADDED Requirements

### Requirement: Lost pets CRUD
The OpenAPI spec SHALL define lost pets endpoints with geolocation filtering.

#### Scenario: List lost pets
- **WHEN** reading the spec
- **THEN** there SHALL be `GET /api/v1/lost-pets?page=1&limit=20&status=lost` returning paginated results

#### Scenario: Get lost pet detail
- **WHEN** reading the spec
- **THEN** there SHALL be `GET /api/v1/lost-pets/{id}` returning full lost pet info with reporter

#### Scenario: Report lost pet
- **WHEN** reading the spec
- **THEN** there SHALL be `POST /api/v1/lost-pets` accepting `{name, species, breed, photo_url, last_seen_lat, last_seen_lng, last_seen_address, description}`

#### Scenario: Update lost pet status
- **WHEN** reading the spec
- **THEN** there SHALL be `PUT /api/v1/lost-pets/{id}` accepting partial fields including `status`

### Requirement: Adoptions CRUD
The OpenAPI spec SHALL define adoption endpoints.

#### Scenario: List adoptions
- **WHEN** reading the spec
- **THEN** there SHALL be `GET /api/v1/adoptions?page=1&limit=20&status=available`

#### Scenario: Get adoption detail
- **WHEN** reading the spec
- **THEN** there SHALL be `GET /api/v1/adoptions/{id}`

#### Scenario: Create adoption listing
- **WHEN** reading the spec
- **THEN** there SHALL be `POST /api/v1/adoptions` accepting `{pet_id, description}`

#### Scenario: Update adoption
- **WHEN** reading the spec
- **THEN** there SHALL be `PUT /api/v1/adoptions/{id}` accepting `{status, adopter_id, description}`

### Requirement: Community schemas
The OpenAPI spec SHALL define `LostPet` and `Adoption` schemas with geolocation fields.

#### Scenario: LostPet schema includes coordinates
- **WHEN** reading the spec
- **THEN** `LostPet` SHALL include `last_seen_lat` and `last_seen_lng` as `number` with `format: double`

#### Scenario: Adoption schema includes status enum
- **WHEN** reading the spec
- **THEN** `Adoption` SHALL include `status` as `string` with an enum constraint
