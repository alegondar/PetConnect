## ADDED Requirements

### Requirement: Delete account endpoint
The backend SHALL expose `DELETE /api/v1/auth/me` that permanently deletes the authenticated user's account.

#### Scenario: Authenticated user deletes account
- **WHEN** an authenticated user sends `DELETE /api/v1/auth/me`
- **THEN** the backend calls `auth.admin.deleteUser(userId)` using the service role key, deletes the row from `profiles`, and returns `{ "detail": "Cuenta eliminada exitosamente" }` with status 200

#### Scenario: Unauthenticated request
- **WHEN** a request without a valid JWT is sent to `DELETE /api/v1/auth/me`
- **THEN** the backend returns 401 Unauthorized

#### Scenario: User not found in profiles
- **WHEN** the JWT is valid but no profile row exists for that user
- **THEN** the backend still calls `auth.admin.deleteUser` and returns 200 (idempotent)

### Requirement: Delete account UI
The frontend SHALL provide a confirmation modal for account deletion that requires the user to type their email.

#### Scenario: User opens delete confirmation
- **WHEN** user clicks "Eliminar cuenta" in the danger zone section
- **THEN** a modal appears with a text input "Escribe tu email para confirmar" and a disabled submit button

#### Scenario: User types correct email
- **WHEN** user types their email exactly matching `supabase.auth.getUser()` email
- **THEN** the submit button becomes enabled (red, destructive style)

#### Scenario: User confirms deletion
- **WHEN** user clicks the enabled submit button
- **THEN** the frontend calls `DELETE /api/v1/auth/me`, clears local auth state, and redirects to `/login` with a success toast
