## ADDED Requirements

### Requirement: Authenticated my-pets endpoint
The backend SHALL expose `GET /api/v1/my-pets` that requires authentication and returns only pets owned by the authenticated user.

#### Scenario: Authenticated user lists their pets
- **WHEN** a user with a valid JWT token calls `GET /api/v1/my-pets?page=1&limit=20`
- **THEN** the response SHALL be a paginated list containing only pets where `owner_id` equals the user's `profiles.id`
- **THEN** the response SHALL have status 200 and include `items`, `total`, `page`, `pages`

#### Scenario: Unauthenticated request
- **WHEN** a request is made to `GET /api/v1/my-pets` without a valid Authorization header
- **THEN** the response SHALL be 401 with `{ "detail": "No autenticado" }`

#### Scenario: User with no pets
- **WHEN** an authenticated user with no pets calls `GET /api/v1/my-pets`
- **THEN** the response SHALL be 200 with `items: []`, `total: 0`

#### Scenario: Pets are isolated by user
- **WHEN** User A creates a pet and User B (different `profiles.id`) calls `GET /api/v1/my-pets`
- **THEN** User B's response SHALL NOT include User A's pet

### Requirement: Pagination support on my-pets
The `GET /api/v1/my-pets` endpoint SHALL support pagination via `page` and `limit` query parameters, with the same defaults as the public `/pets` endpoint.

#### Scenario: Pagination with defaults
- **WHEN** a user calls `GET /api/v1/my-pets` without pagination parameters
- **THEN** defaults SHALL be `page=1`, `limit=20`

#### Scenario: Pagination with custom limit
- **WHEN** a user calls `GET /api/v1/my-pets?page=2&limit=5`
- **THEN** the response SHALL return the second page with at most 5 items

### Requirement: Results ordered by newest first
The `GET /api/v1/my-pets` endpoint SHALL return pets ordered by `created_at` descending.

#### Scenario: Newest pets first
- **WHEN** a user has pets created at different times
- **THEN** the most recently created pet SHALL appear first in the response
