## ADDED Requirements

### Requirement: Forgot password page
The system SHALL provide a `ForgotPasswordPage` at `/forgot-password` with an email field that sends a password reset magic link.

#### Scenario: User requests password reset
- **WHEN** user enters their email and submits
- **THEN** the system calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: '/settings/reset-password' })` and displays "Te enviamos un enlace de recuperación a tu email"

#### Scenario: Email not found
- **WHEN** the email does not correspond to a registered user
- **THEN** the system still displays the success message (Supabase does not reveal if email exists for security)

#### Scenario: Back to login
- **WHEN** user clicks "Volver al inicio de sesión"
- **THEN** the system navigates to `/login`

### Requirement: Reset password page
The system SHALL provide a `ResetPasswordPage` at `/settings/reset-password` that captures the token from the URL and allows setting a new password.

#### Scenario: User opens reset link
- **WHEN** user clicks the magic link from their email
- **THEN** the system redirects to `/settings/reset-password` with `#access_token=...` in the URL

#### Scenario: User sets new password
- **WHEN** user enters a new password (min 6 chars), confirms it, and submits
- **THEN** the system calls `supabase.auth.updateUser({ password })`, shows success, and redirects to `/feed`

#### Scenario: Passwords do not match
- **WHEN** user enters mismatched passwords
- **THEN** the system displays "Las contraseñas no coinciden"

#### Scenario: Password too short
- **WHEN** user enters a password with fewer than 6 characters
- **THEN** the system displays "La contraseña debe tener al menos 6 caracteres"

### Requirement: Forgot password link on login page
The LoginPage SHALL display a "Olvidé tu contraseña?" link that navigates to `/forgot-password`.

#### Scenario: User clicks forgot password
- **WHEN** user is on the login page and clicks "Olvidé tu contraseña?"
- **THEN** the system navigates to `/forgot-password`
