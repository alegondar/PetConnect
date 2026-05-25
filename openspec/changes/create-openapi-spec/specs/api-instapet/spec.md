## ADDED Requirements

### Requirement: InstaPet posts endpoints
The OpenAPI spec SHALL define endpoints for posts on a specific pet's InstaPet profile.

#### Scenario: List pet's InstaPet posts
- **WHEN** reading the spec
- **THEN** there SHALL be `GET /api/v1/pets/{pet_id}/instapet/posts?page=1&limit=20` returning paginated InstaPet posts

#### Scenario: Get single InstaPet post
- **WHEN** reading the spec
- **THEN** there SHALL be `GET /api/v1/pets/{pet_id}/instapet/posts/{post_id}`

#### Scenario: Create InstaPet post
- **WHEN** reading the spec
- **THEN** there SHALL be `POST /api/v1/pets/{pet_id}/instapet/posts` accepting `{photo_url, video_url, description}`

#### Scenario: Delete InstaPet post
- **WHEN** reading the spec
- **THEN** there SHALL be `DELETE /api/v1/pets/{pet_id}/instapet/posts/{post_id}` returning 204

### Requirement: InstaPet followers endpoints
The OpenAPI spec SHALL define follow/unfollow endpoints for pets.

#### Scenario: List pet's followers
- **WHEN** reading the spec
- **THEN** there SHALL be `GET /api/v1/pets/{pet_id}/followers?page=1&limit=20`

#### Scenario: Follow a pet
- **WHEN** reading the spec
- **THEN** there SHALL be `POST /api/v1/pets/{pet_id}/follow` returning 201

#### Scenario: Unfollow a pet
- **WHEN** reading the spec
- **THEN** there SHALL be `DELETE /api/v1/pets/{pet_id}/follow` returning 204

#### Scenario: List followed pets
- **WHEN** reading the spec
- **THEN** there SHALL be `GET /api/v1/me/following?page=1&limit=20`

### Requirement: InstaPet milestones endpoints
The OpenAPI spec SHALL define milestone endpoints for a pet's life moments.

#### Scenario: List pet's milestones
- **WHEN** reading the spec
- **THEN** there SHALL be `GET /api/v1/pets/{pet_id}/milestones?page=1&limit=20`

#### Scenario: Create milestone
- **WHEN** reading the spec
- **THEN** there SHALL be `POST /api/v1/pets/{pet_id}/milestones` accepting `{title, description, photo_url, milestone_date}`

### Requirement: InstaPet schemas
The OpenAPI spec SHALL define `InstaPetPost`, `InstaPetFollower`, and `InstaPetMilestone` schemas.

#### Scenario: InstaPetPost schema defined
- **WHEN** reading the spec
- **THEN** `components/schemas/InstaPetPost` SHALL include `id, pet_id, author_id, photo_url, video_url, description, likes_count, comments_count, created_at`

#### Scenario: InstaPetMilestone schema defined
- **WHEN** reading the spec
- **THEN** `components/schemas/InstaPetMilestone` SHALL include `id, pet_id, title, description, photo_url, milestone_date, created_at`
