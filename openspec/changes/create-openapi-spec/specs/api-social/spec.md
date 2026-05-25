## ADDED Requirements

### Requirement: Posts CRUD
The OpenAPI spec SHALL define feed post endpoints with pagination.

#### Scenario: List feed posts
- **WHEN** reading the spec
- **THEN** there SHALL be `GET /api/v1/feed?page=1&limit=20` returning paginated posts with `author` and `pet` info embedded

#### Scenario: Get post detail
- **WHEN** reading the spec
- **THEN** there SHALL be `GET /api/v1/feed/{post_id}` returning the post with likes and comments

#### Scenario: Create post
- **WHEN** reading the spec
- **THEN** there SHALL be `POST /api/v1/feed` accepting `{pet_id, content, photo_url}`

#### Scenario: Delete post
- **WHEN** reading the spec
- **THEN** there SHALL be `DELETE /api/v1/feed/{post_id}` returning 204

### Requirement: Likes endpoints
The OpenAPI spec SHALL define like/unlike endpoints.

#### Scenario: Like a post
- **WHEN** reading the spec
- **THEN** there SHALL be `POST /api/v1/feed/{post_id}/like` returning 201 on success

#### Scenario: Unlike a post
- **WHEN** reading the spec
- **THEN** there SHALL be `DELETE /api/v1/feed/{post_id}/like` returning 204 on success

### Requirement: Comments CRUD
The OpenAPI spec SHALL define comment endpoints nested under posts.

#### Scenario: List comments
- **WHEN** reading the spec
- **THEN** there SHALL be `GET /api/v1/feed/{post_id}/comments?page=1&limit=20`

#### Scenario: Create comment
- **WHEN** reading the spec
- **THEN** there SHALL be `POST /api/v1/feed/{post_id}/comments` accepting `{content}`

#### Scenario: Delete comment
- **WHEN** reading the spec
- **THEN** there SHALL be `DELETE /api/v1/feed/{post_id}/comments/{comment_id}` returning 204

### Requirement: Social schemas
The OpenAPI spec SHALL define `Post`, `Like`, and `Comment` schemas.

#### Scenario: Post includes embedded data
- **WHEN** reading the spec
- **THEN** `Post` SHALL include `id, pet_id, author_id, content, photo_url, likes_count, comments_count, created_at` and optionally `author: Profile` and `pet: Pet`
