## ADDED Requirements

### Requirement: Pets CRUD
The backend SHALL implement full CRUD for `/api/v1/pets` with ownership enforcement.

#### Scenario: List pets with filters
- **WHEN** `GET /api/v1/pets?page=1&limit=20&species=dog` is called
- **THEN** a paginated list of dogs SHALL be returned

#### Scenario: Create pet
- **WHEN** an authenticated user creates a pet
- **THEN** the pet SHALL be inserted with `owner_id = current_user.id`

#### Scenario: Get pet by ID
- **WHEN** `GET /api/v1/pets/{pet_id}` is called
- **THEN** the full Pet object SHALL be returned

#### Scenario: Update pet (only owner)
- **WHEN** a non-owner tries to update a pet
- **THEN** HTTPException 403 SHALL be raised

#### Scenario: Delete pet
- **WHEN** the owner deletes their pet
- **THEN** the pet and all related data SHALL be cascade-deleted

### Requirement: Vet visits CRUD
The backend SHALL implement CRUD for `/api/v1/pets/{pet_id}/vet-visits` with ownership validation.

#### Scenario: List vet visits
- **WHEN** the owner requests vet visits for their pet
- **THEN** a paginated list SHALL be returned

#### Scenario: Non-owner cannot create visit
- **WHEN** a user tries to register a visit for a pet they don't own
- **THEN** HTTPException 403 SHALL be raised

### Requirement: Pet events CRUD
The backend SHALL implement CRUD for `/api/v1/pets/{pet_id}/events` with event_type validation.

#### Scenario: Create event
- **WHEN** a valid `{event_type, event_date, value}` is posted
- **THEN** the event SHALL be created linked to the pet

#### Scenario: Invalid event_type
- **WHEN** an invalid `event_type` is posted
- **THEN** HTTPException 422 SHALL be raised
