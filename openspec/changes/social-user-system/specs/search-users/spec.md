## ADDED Requirements

### Requirement: Search users page
The system SHALL provide a `SearchUsersPage` at `/search` for finding users.

#### Scenario: Search with debounce
- **WHEN** user types in the search input
- **THEN** after 300ms of inactivity, `GET /api/v1/users?q=text` is called and results are displayed

#### Scenario: No results
- **WHEN** search returns zero users
- **THEN** the page shows "No encontramos usuarios con ese nombre"

#### Scenario: Empty input
- **WHEN** the search input is empty
- **THEN** the page shows suggested users (most followers or most recent)

#### Scenario: User card in results
- **WHEN** search returns users
- **THEN** each result shows avatar, username, full_name, followers count, and a FollowButton

#### Scenario: Unauthenticated access
- **WHEN** an unauthenticated user navigates to `/search`
- **THEN** they are redirected to `/login`
