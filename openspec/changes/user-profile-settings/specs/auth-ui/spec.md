## ADDED Requirements

### Requirement: Settings gear icon in header
The Layout component SHALL display a gear icon (⚙️) in the header that navigates to `/settings` for authenticated users.

#### Scenario: Authenticated user sees gear icon
- **WHEN** user is logged in and viewing any page with the header visible
- **THEN** the header shows a gear icon that links to `/settings`

#### Scenario: Unauthenticated user on login page
- **WHEN** user is on `/login` or `/register`
- **THEN** the header is hidden (existing behavior, no change)

### Requirement: Profile section edit endpoint
The backend `PUT /api/v1/auth/me` SHALL accept `full_name` in addition to existing fields.

#### Scenario: User updates full_name
- **WHEN** user sends `PUT /api/v1/auth/me` with `{ "full_name": "Juan Pérez" }`
- **THEN** the backend updates the `full_name` column in `profiles` and returns the updated profile

#### Scenario: full_name not provided
- **WHEN** user sends `PUT /api/v1/auth/me` without `full_name`
- **THEN** the backend preserves the existing `full_name` value (no change)
