## ADDED Requirements

### Requirement: Get user public profile
The system SHALL expose `GET /api/v1/users/:userId` returning a user's public profile.

#### Scenario: View any user profile
- **WHEN** a request is made to `GET /api/v1/users/:userId`
- **THEN** the response includes `id`, `username`, `full_name`, `avatar_url`, `bio`, `followers_count`, `following_count`, `posts_count`, and `is_following` (boolean, false if no auth token)

#### Scenario: View profile with auth token
- **WHEN** an authenticated user requests another user's profile
- **THEN** `is_following` is `true` if the authenticated user follows them, `false` otherwise

### Requirement: Get user posts
The system SHALL expose `GET /api/v1/users/:userId/posts` returning paginated posts by a user.

#### Scenario: View user posts
- **WHEN** a request is made with `?page=1&limit=20`
- **THEN** the response includes a paginated list of posts where `author_id = userId`, ordered by `created_at DESC`

### Requirement: Get user followers
The system SHALL expose `GET /api/v1/users/:userId/followers` returning paginated followers.

#### Scenario: View followers list
- **WHEN** a request is made
- **THEN** the response includes a paginated list of profiles with `is_following` for each

### Requirement: Get user following
The system SHALL expose `GET /api/v1/users/:userId/following` returning paginated followed users.

#### Scenario: View following list
- **WHEN** a request is made
- **THEN** the response includes a paginated list of profiles with `is_following` for each

### Requirement: Follow a user
The system SHALL expose `POST /api/v1/users/:userId/follow` to follow a user. Auth required.

#### Scenario: Follow success
- **WHEN** authenticated user posts to follow another user
- **THEN** a row is inserted into `user_follows` and 201 is returned

#### Scenario: Already following
- **WHEN** the follow relationship already exists
- **THEN** 409 Conflict is returned

#### Scenario: Self-follow
- **WHEN** user tries to follow themselves
- **THEN** 400 Bad Request is returned

### Requirement: Unfollow a user
The system SHALL expose `DELETE /api/v1/users/:userId/follow` to unfollow. Auth required.

#### Scenario: Unfollow success
- **WHEN** authenticated user deletes a follow relationship
- **THEN** the row is removed from `user_follows` and 200 is returned

### Requirement: Search users
The system SHALL expose `GET /api/v1/users?q=text` to search users by username or full_name.

#### Scenario: Search by username
- **WHEN** a request is made with `?q=juan`
- **THEN** users whose `username` or `full_name` ILIKE `%juan%` are returned with `is_following`

#### Scenario: Empty search
- **WHEN** no `q` parameter is provided
- **THEN** the most recent or most-followed users are returned as suggestions

### Requirement: Personalized feed
The system SHALL modify `GET /api/v1/feed` to accept `?mode=following`.

#### Scenario: Following feed
- **WHEN** authenticated user requests `GET /api/v1/feed?mode=following`
- **THEN** only posts from followed users are returned

#### Scenario: Following feed without auth
- **WHEN** unauthenticated user requests `GET /api/v1/feed?mode=following`
- **THEN** 401 Unauthorized is returned

#### Scenario: Global feed (default)
- **WHEN** `mode` is not specified or is `global`
- **THEN** all posts are returned (existing behavior)
