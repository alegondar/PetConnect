## ADDED Requirements

### Requirement: Feed posts CRUD
The backend SHALL implement `/api/v1/feed` with pagination and author/pet embedding.

#### Scenario: List feed posts
- **WHEN** `GET /api/v1/feed?page=1&limit=20` is called
- **THEN** posts SHALL be returned ordered by `created_at` DESC with embedded `author` and `pet` data

#### Scenario: Create post
- **WHEN** a user creates a post with `{pet_id, content, photo_url}`
- **THEN** the post SHALL be created and the Post object returned

#### Scenario: Delete post (only author)
- **WHEN** a non-author tries to delete a post
- **THEN** HTTPException 403 SHALL be raised

### Requirement: Likes
The backend SHALL implement like/unlike with uniqueness enforcement.

#### Scenario: Like a post
- **WHEN** a user likes a post they haven't liked
- **THEN** the like SHALL be created and likes_count incremented

#### Scenario: Duplicate like
- **WHEN** a user tries to like a post they already liked
- **THEN** HTTPException 409 SHALL be raised

### Requirement: Comments CRUD
The backend SHALL implement comment endpoints with author embedding.

#### Scenario: Create comment
- **WHEN** `POST /api/v1/feed/{post_id}/comments` with `{content}`
- **THEN** the comment SHALL be created and comments_count incremented

#### Scenario: Delete comment (only author)
- **WHEN** a user tries to delete another user's comment
- **THEN** HTTPException 403 SHALL be raised

### Requirement: Get post detail
The backend SHALL return post detail with `liked_by_me` flag for the authenticated user.

#### Scenario: Post detail for authenticated user
- **WHEN** an authenticated user requests a post detail
- **THEN** the response SHALL include `liked_by_me: true|false`
