## ADDED Requirements

### Requirement: Services navigation link
The Layout navigation bar SHALL include a "Servicios" link with a paw/patita icon that navigates to `/services`.

#### Scenario: Click services link
- **WHEN** authenticated user clicks the "Servicios" navigation item
- **THEN** the app navigates to `/services`

#### Scenario: Hidden for unauthenticated users
- **WHEN** the user is not logged in
- **THEN** the "Servicios" link is not visible
