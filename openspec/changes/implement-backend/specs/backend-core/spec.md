## ADDED Requirements

### Requirement: FastAPI application setup
The backend SHALL have a configured FastAPI app with CORS, Supabase client, and router registration.

#### Scenario: App starts
- **WHEN** running `uvicorn app.main:app`
- **THEN** the server SHALL start on port 8000 with all routers mounted

### Requirement: Supabase client
The backend SHALL initialize a Supabase client using environment variables `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`.

#### Scenario: Supabase client configured
- **WHEN** the app is loaded
- **THEN** a singleton Supabase client SHALL be available for auth and database operations

### Requirement: Auth middleware
The backend SHALL implement a `get_current_user` dependency that validates the Bearer JWT token against Supabase Auth.

#### Scenario: Valid token
- **WHEN** a request includes a valid JWT in the Authorization header
- **THEN** the dependency SHALL return the user's profile

#### Scenario: Invalid or missing token
- **WHEN** a request has no token or an invalid token
- **THEN** the dependency SHALL raise HTTPException 401

### Requirement: CORS middleware
The backend SHALL configure CORS to allow requests from the frontend origin (localhost:5173 for dev).

#### Scenario: CORS preflight
- **WHEN** a browser sends an OPTIONS preflight request
- **THEN** the server SHALL respond with appropriate CORS headers

### Requirement: Pagination helper
The backend SHALL provide a reusable pagination helper that computes `{items, total, page, pages}` from a query result.

#### Scenario: Paginated response
- **WHEN** a GET list endpoint is called with `?page=2&limit=20`
- **THEN** the response SHALL include `page: 2, pages: <total/limit>`
