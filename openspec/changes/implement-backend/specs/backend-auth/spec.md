## ADDED Requirements

### Requirement: Register endpoint
The backend SHALL implement `POST /api/v1/auth/register` using Supabase Auth signup.

#### Scenario: Successful registration
- **WHEN** a valid `{email, password, username}` is posted
- **THEN** a new user SHALL be created in Supabase Auth and `profiles` table, returning `{access_token, token_type, profile}`

#### Scenario: Duplicate email
- **WHEN** an email that already exists is used
- **THEN** the endpoint SHALL raise HTTPException 409

### Requirement: Login endpoint
The backend SHALL implement `POST /api/v1/auth/login` using Supabase Auth signin.

#### Scenario: Successful login
- **WHEN** valid credentials are posted
- **THEN** the endpoint SHALL return `{access_token, token_type, profile}`

#### Scenario: Invalid credentials
- **WHEN** wrong email or password is posted
- **THEN** the endpoint SHALL raise HTTPException 401

### Requirement: Profile endpoint
The backend SHALL implement `GET /api/v1/auth/me` and `PUT /api/v1/auth/me`.

#### Scenario: Get own profile
- **WHEN** an authenticated user requests their profile
- **THEN** the endpoint SHALL return the full Profile object

#### Scenario: Update profile
- **WHEN** an authenticated user sends `{username, avatar_url, bio}`
- **THEN** the profile SHALL be updated in the `profiles` table
