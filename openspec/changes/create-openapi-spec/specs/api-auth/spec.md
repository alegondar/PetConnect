## ADDED Requirements

### Requirement: Auth endpoints
The OpenAPI spec SHALL define authentication endpoints under the `Auth` tag.

#### Scenario: Register endpoint
- **WHEN** reading the spec
- **THEN** there SHALL be `POST /api/v1/auth/register` accepting `{email, password, username}` and returning a profile with JWT token

#### Scenario: Login endpoint
- **WHEN** reading the spec
- **THEN** there SHALL be `POST /api/v1/auth/login` accepting `{email, password}` and returning `{access_token, token_type, profile}`

### Requirement: Profile endpoint
The OpenAPI spec SHALL define profile management endpoints.

#### Scenario: GET own profile
- **WHEN** reading the spec
- **THEN** there SHALL be `GET /api/v1/auth/me` returning the authenticated user's profile

#### Scenario: PUT update profile
- **WHEN** reading the spec
- **THEN** there SHALL be `PUT /api/v1/auth/me` accepting `{username, avatar_url, bio}` and returning the updated profile

### Requirement: Security scheme
The OpenAPI spec SHALL define Bearer JWT as the global security scheme.

#### Scenario: Security scheme declared
- **WHEN** reading the spec
- **THEN** `components/securitySchemes` SHALL contain `bearerAuth` with `type: http, scheme: bearer, bearerFormat: JWT`

#### Scenario: Global security applied
- **WHEN** reading the spec
- **THEN** the root `security` SHALL apply `bearerAuth` globally, with auth endpoints excluded via empty `security: []`
