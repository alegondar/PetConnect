## ADDED Requirements

### Requirement: Lost pets CRUD
The backend SHALL implement `/api/v1/lost-pets` with geolocation and status filtering.

#### Scenario: List lost pets with status filter
- **WHEN** `GET /api/v1/lost-pets?status=lost` is called
- **THEN** only pets with status 'lost' SHALL be returned

#### Scenario: Report lost pet
- **WHEN** `{name, species, last_seen_lat, last_seen_lng}` is posted
- **THEN** the report SHALL be created with `reporter_id = current_user.id`

#### Scenario: Get lost pet detail with reporter
- **WHEN** `GET /api/v1/lost-pets/{id}` is called
- **THEN** the full LostPet SHALL be returned with embedded `reporter` Profile

#### Scenario: Non-reporter cannot update
- **WHEN** a non-reporter tries to update a lost pet report
- **THEN** HTTPException 403 SHALL be raised

### Requirement: Adoptions CRUD
The backend SHALL implement `/api/v1/adoptions` with status transitions.

#### Scenario: Create adoption listing
- **WHEN** a user publishes `{pet_id, description}`
- **THEN** the adoption SHALL be created with `owner_id = current_user.id` and status 'available'

#### Scenario: Update adoption status
- **WHEN** the owner updates status to 'adopted' with an `adopter_id`
- **THEN** the record SHALL be updated

#### Scenario: List available adoptions
- **WHEN** `GET /api/v1/adoptions?status=available` is called
- **THEN** only available adoptions SHALL be returned

#### Scenario: Non-owner cannot modify
- **WHEN** a non-owner tries to update an adoption listing
- **THEN** HTTPException 403 SHALL be raised
