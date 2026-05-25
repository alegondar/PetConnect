## ADDED Requirements

### Requirement: JWT token verification uses correct secret
The backend SHALL verify Supabase-issued JWT access tokens using the HMAC secret configured via `JWT_SECRET` environment variable, with `SECRET_KEY` as fallback, and `SUPABASE_SERVICE_KEY` as last resort. The verification MUST succeed for valid tokens and fail for expired or tampered tokens.

#### Scenario: Valid token with JWT_SECRET set
- **WHEN** the frontend sends a request with `Authorization: Bearer <valid-supabase-token>`
- **THEN** `get_current_user` decodes the token successfully and returns the user's profile dict from the database

#### Scenario: Valid token with SECRET_KEY fallback
- **WHEN** `JWT_SECRET` is not set but `SECRET_KEY` contains the Supabase JWT secret
- **THEN** `get_current_user` uses `SECRET_KEY` to verify the token and returns the user's profile dict

#### Scenario: Invalid or expired token
- **WHEN** the frontend sends a request with an expired or tampered token
- **THEN** the backend returns HTTP 401 with detail "Token inválido o expirado"

### Requirement: create_pet uses profile UUID as owner_id
The `POST /pets` endpoint SHALL use the authenticated user's profile UUID (`user["id"]`) as the `owner_id` when creating a new pet record.

#### Scenario: Create pet with authenticated user
- **WHEN** a user with profile UUID `abc-123` creates a pet via `POST /pets` with `{"name": "Firulais", "species": "Perro"}`
- **THEN** the pet record is inserted with `owner_id = "abc-123"` (matching `profiles.id`)

#### Scenario: Owner can access their pet
- **WHEN** the owner requests `GET /pets/<pet_id>` for a pet they created
- **THEN** the pet is returned with the correct owner relationship

### Requirement: Photo upload via multipart form data
The `POST /pets/upload-photo` endpoint SHALL accept an image file as multipart form data with field name `file`. The endpoint MUST authenticate the user via JWT, upload the file to Supabase Storage bucket `pets`, and return the public URL.

#### Scenario: Successful photo upload
- **WHEN** an authenticated user sends `POST /pets/upload-photo` with a valid image file in field `file`
- **THEN** the file is stored in Supabase Storage at `pets/<user_id>/<uuid>-<filename>` and returns `{"url": "https://<supabase-url>/storage/v1/object/public/pets/<user_id>/<uuid>-<filename>"}`

#### Scenario: Unauthenticated upload request
- **WHEN** a request without a valid `Authorization` header is sent to `POST /pets/upload-photo`
- **THEN** the backend returns HTTP 401 and the frontend interceptor does NOT redirect to login (the interceptor handles 401 by clearing auth state)

### Requirement: Frontend multipart upload without manual Content-Type
The frontend SHALL send file upload requests via Axios with `FormData` body WITHOUT manually setting the `Content-Type` header.

#### Scenario: Upload with axios and FormData
- **WHEN** the frontend calls `api.post('/pets/upload-photo', formData)` with a `FormData` containing a file
- **THEN** Axios automatically generates the `Content-Type: multipart/form-data; boundary=...` header with the correct boundary value

#### Scenario: Upload error does not redirect to login for non-401 errors
- **WHEN** the upload endpoint returns a non-401 error (e.g., 500, 404)
- **THEN** the frontend shows an inline error message without redirecting to `/login`
