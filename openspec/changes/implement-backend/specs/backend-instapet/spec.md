## ADDED Requirements

### Requirement: InstaPet posts CRUD
The backend SHALL implement `/api/v1/pets/{pet_id}/instapet/posts` with ownership validation.

#### Scenario: List pet's InstaPet posts
- **WHEN** `GET /api/v1/pets/{pet_id}/instapet/posts?page=1&limit=20` is called
- **THEN** posts for that pet SHALL be returned with embedded author

#### Scenario: Create InstaPet post
- **WHEN** the pet owner posts `{photo_url, video_url, description}`
- **THEN** the post SHALL be created

#### Scenario: Non-owner cannot post
- **WHEN** a non-owner tries to create an InstaPet post
- **THEN** HTTPException 403 SHALL be raised

### Requirement: Followers
The backend SHALL implement follow/unfollow with uniqueness and bidirectional queries.

#### Scenario: Follow a pet
- **WHEN** a user follows a pet they don't already follow
- **THEN** the follower record SHALL be created

#### Scenario: Duplicate follow
- **WHEN** a user tries to follow a pet they already follow
- **THEN** HTTPException 409 SHALL be raised

#### Scenario: List followers
- **WHEN** `GET /api/v1/pets/{pet_id}/followers` is called
- **THEN** a paginated list of followers with profile data SHALL be returned

#### Scenario: List following
- **WHEN** `GET /api/v1/me/following` is called
- **THEN** a paginated list of followed pets SHALL be returned

### Requirement: Milestones CRUD
The backend SHALL implement `/api/v1/pets/{pet_id}/milestones` with owner-only write access.

#### Scenario: Create milestone
- **WHEN** the pet owner creates `{title, milestone_date, description, photo_url}`
- **THEN** the milestone SHALL be created

#### Scenario: List milestones
- **WHEN** `GET /api/v1/pets/{pet_id}/milestones` is called
- **THEN** milestones SHALL be returned ordered by `milestone_date` DESC

#### Scenario: Non-owner cannot create milestone
- **WHEN** a non-owner tries to create a milestone
- **THEN** HTTPException 403 SHALL be raised
