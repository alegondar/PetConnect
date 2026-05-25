## ADDED Requirements

### Requirement: Token verification uses Supabase Auth API
The backend SHALL verify JWT access tokens by calling `supabase.auth.get_user(token)` instead of manually decoding the JWT with a hardcoded algorithm. The verification MUST succeed for valid tokens regardless of the signing algorithm used by Supabase (HS256, ES256, RS256, etc.).

#### Scenario: Valid P-256 (ES256) token
- **WHEN** the frontend sends `Authorization: Bearer <valid-es256-token>`
- **THEN** `supabase.auth.get_user(token)` returns the user object with `user.id` and the backend proceeds to lookup the profile

#### Scenario: Valid HS256 token (legacy)
- **WHEN** the frontend sends a token signed with the legacy HS256 algorithm
- **THEN** `supabase.auth.get_user(token)` still validates successfully and returns the user

#### Scenario: Expired token
- **WHEN** the frontend sends an expired token
- **THEN** `supabase.auth.get_user(token)` raises an exception and the backend returns HTTP 401 with detail "Token inválido o expirado"

#### Scenario: Revoked or tampered token
- **WHEN** the frontend sends a token that has been revoked or modified
- **THEN** the backend returns HTTP 401 without exposing internal error details

### Requirement: Token extraction via HTTPBearer unchanged
The backend SHALL continue to extract the JWT token from the `Authorization: Bearer <token>` header using FastAPI's `HTTPBearer` security scheme.

#### Scenario: Request with valid Authorization header
- **WHEN** a request includes `Authorization: Bearer eyJhbGciOi...`
- **THEN** `HTTPBearer` extracts the token string and passes it to `get_current_user`

#### Scenario: Request without Authorization header
- **WHEN** a request is made without an `Authorization` header
- **THEN** FastAPI returns HTTP 403 before `get_current_user` is called

### Requirement: Profile lookup after token validation
After successful token validation via Supabase Auth, the backend SHALL query the `profiles` table using `user_id` (the Supabase Auth user ID) to retrieve the full profile record.

#### Scenario: Profile exists for authenticated user
- **WHEN** `supabase.auth.get_user(token)` returns `user.id = "abc-123"` and a profile row exists with `user_id = "abc-123"`
- **THEN** `get_current_user` returns the profile dict with `id`, `user_id`, `username`, `avatar_url`, `bio`

#### Scenario: No profile found for valid token
- **WHEN** token validation succeeds but no profile row matches `user_id`
- **THEN** the backend returns HTTP 401 with detail "Usuario no encontrado"
