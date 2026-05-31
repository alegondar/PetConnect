## ADDED Requirements

### Requirement: List service offers
The backend SHALL expose `GET /api/v1/services/offers` returning paginated service offers filtered by optional `type` and `location` query params.

#### Scenario: List all offers
- **WHEN** client requests `GET /api/v1/services/offers?page=1&limit=20`
- **THEN** response includes `items` array of offers ordered by `created_at DESC` with `total`, `page`, `pages`

#### Scenario: Filter by type
- **WHEN** client requests `GET /api/v1/services/offers?type=paseador`
- **THEN** response includes only offers with `service_type = 'paseador'`

### Requirement: Get service offer detail
The backend SHALL expose `GET /api/v1/services/offers/:id` returning the full offer with provider profile (username, avatar_url, followers_count).

#### Scenario: Get offer with provider data
- **WHEN** client requests a specific offer
- **THEN** response includes offer fields plus `provider: { username, avatar_url, followers_count }`

### Requirement: Create service offer
The backend SHALL expose `POST /api/v1/services/offers` (authenticated) to create a new offer.

#### Scenario: Authenticated create
- **WHEN** authenticated user posts valid offer data
- **THEN** offer is created with `provider_id = userId`, returns 201 with the created offer

#### Scenario: Unauthenticated
- **WHEN** request has no valid JWT
- **THEN** 401 is returned

### Requirement: Update service offer
The backend SHALL expose `PUT /api/v1/services/offers/:id` (authenticated, owner only) to update an offer.

#### Scenario: Owner updates
- **WHEN** the offer's provider updates their own offer
- **THEN** offer is updated, returns 200

#### Scenario: Non-owner blocked
- **WHEN** a different user tries to update
- **THEN** 403 is returned

### Requirement: Delete service offer
The backend SHALL expose `DELETE /api/v1/services/offers/:id` (authenticated, owner only).

#### Scenario: Owner deletes
- **WHEN** the provider deletes their offer
- **THEN** returns 204

### Requirement: List service requests
The backend SHALL expose `GET /api/v1/services/requests` returning paginated service requests filtered by optional `type` query param.

#### Scenario: List all requests
- **WHEN** client requests `GET /api/v1/services/requests?page=1&limit=20`
- **THEN** response includes requests ordered by `created_at DESC`

### Requirement: Get request detail
The backend SHALL expose `GET /api/v1/services/requests/:id` with requester profile and optionally pet data.

#### Scenario: Get request with pet
- **WHEN** client requests a request that has a pet_id
- **THEN** response includes `requester: { username, avatar_url }` and `pet: { name, photo_url, species }`

### Requirement: CRUD for service requests
The backend SHALL support `POST /api/v1/services/requests` (create), `PUT /api/v1/services/requests/:id` (update, owner only), and `DELETE /api/v1/services/requests/:id` (delete, owner only), all authenticated.

#### Scenario: Create request
- **WHEN** authenticated user posts valid request data
- **THEN** request is created with `requester_id = userId`, returns 201

### Requirement: Contact endpoints
The backend SHALL expose `POST /api/v1/services/requests/:id/contact` and `POST /api/v1/services/offers/:id/contact` (both authenticated) to send a contact message.

#### Scenario: Contact request author
- **WHEN** authenticated user sends a message to a request
- **THEN** a `service_contacts` row is created with `request_id` and `receiver_id = request.requester_id`

#### Scenario: Contact offer provider
- **WHEN** authenticated user sends a message to an offer
- **THEN** a `service_contacts` row is created with `offer_id` and `receiver_id = offer.provider_id`

### Requirement: My contacts endpoint
The backend SHALL expose `GET /api/v1/services/my-contacts` (authenticated) returning all contact messages where the authenticated user is the receiver.

#### Scenario: Get received messages
- **WHEN** authenticated user requests their contacts
- **THEN** response includes messages ordered by `created_at DESC` with sender profile info
