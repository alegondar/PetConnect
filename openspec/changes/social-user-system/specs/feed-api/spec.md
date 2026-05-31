## ADDED Requirements

### Requirement: Feed mode query parameter
`GET /api/v1/feed` SHALL accept an optional `mode` query parameter with values `global` (default) or `following`.

#### Scenario: Following mode with auth
- **WHEN** authenticated user requests `GET /api/v1/feed?mode=following`
- **THEN** only posts from followed users are returned, paginated

#### Scenario: Following mode without auth
- **WHEN** unauthenticated user requests `GET /api/v1/feed?mode=following`
- **THEN** 401 Unauthorized is returned

#### Scenario: Default global mode
- **WHEN** `mode` is omitted or set to `global`
- **THEN** all posts are returned (existing behavior unchanged)
