## ADDED Requirements

### Requirement: Pets CRUD endpoints
The OpenAPI spec SHALL define full CRUD for `pets` with paginated list.

#### Scenario: List pets
- **WHEN** reading the spec
- **THEN** there SHALL be `GET /api/v1/pets?page=1&limit=20&species=dog` returning `{items: Pet[], total, page, pages}`

#### Scenario: Get pet by ID
- **WHEN** reading the spec
- **THEN** there SHALL be `GET /api/v1/pets/{pet_id}` returning the full `Pet` object

#### Scenario: Create pet
- **WHEN** reading the spec
- **THEN** there SHALL be `POST /api/v1/pets` accepting `{name, species, breed, age, weight, photo_url, bio}` returning the created `Pet`

#### Scenario: Update pet
- **WHEN** reading the spec
- **THEN** there SHALL be `PUT /api/v1/pets/{pet_id}` accepting partial pet fields

#### Scenario: Delete pet
- **WHEN** reading the spec
- **THEN** there SHALL be `DELETE /api/v1/pets/{pet_id}` returning 204 on success

### Requirement: Vet visits endpoints
The OpenAPI spec SHALL define vet visit management nested under pets.

#### Scenario: List vet visits for a pet
- **WHEN** reading the spec
- **THEN** there SHALL be `GET /api/v1/pets/{pet_id}/vet-visits?page=1&limit=20`

#### Scenario: Create vet visit
- **WHEN** reading the spec
- **THEN** there SHALL be `POST /api/v1/pets/{pet_id}/vet-visits` accepting `{vet_name, visit_date, reason, notes}`

### Requirement: Pet events endpoints
The OpenAPI spec SHALL define InstaPet event management nested under pets.

#### Scenario: List events for a pet
- **WHEN** reading the spec
- **THEN** there SHALL be `GET /api/v1/pets/{pet_id}/events?page=1&limit=20`

#### Scenario: Create event
- **WHEN** reading the spec
- **THEN** there SHALL be `POST /api/v1/pets/{pet_id}/events` accepting `{event_type, event_date, value, notes}`

### Requirement: Pet schemas
The OpenAPI spec SHALL define `Pet`, `VetVisit`, and `PetEvent` schemas matching the database columns.

#### Scenario: Pet schema defined
- **WHEN** reading the spec
- **THEN** `components/schemas/Pet` SHALL include `id, owner_id, name, species, breed, age, weight, photo_url, bio, created_at, updated_at`
