## ADDED Requirements

### Requirement: Settings page with sections
The system SHALL provide a `/settings` page accessible to authenticated users, with five clearly separated sections: Perfil, Cuenta, Notificaciones, Sesión, and Zona de peligro.

#### Scenario: User navigates to settings
- **WHEN** an authenticated user clicks the gear icon in the header
- **THEN** the system navigates to `/settings` and renders the SettingsPage with all five sections

#### Scenario: Unauthenticated user accesses /settings
- **WHEN** an unauthenticated user navigates to `/settings`
- **THEN** the system redirects to `/login`

### Requirement: Profile section — avatar upload
The system SHALL allow users to upload a profile photo to Supabase Storage bucket `avatars` and display it as their avatar.

#### Scenario: User uploads a new avatar
- **WHEN** user selects an image file in the AvatarUpload component
- **THEN** the system uploads it to `avatars/{userId}/avatar.{ext}`, gets the public URL, and updates the profile via `PUT /api/v1/auth/me`

#### Scenario: Upload fails due to file type
- **WHEN** user selects a non-image file (e.g., .pdf)
- **THEN** the system displays an error message "Formato no soportado. Usa JPG o PNG"

### Requirement: Profile section — edit user info
The system SHALL allow users to edit username, full_name, and bio via `PUT /api/v1/auth/me`.

#### Scenario: User updates profile fields
- **WHEN** user edits username, full_name, or bio and clicks "Guardar cambios"
- **THEN** the system calls `PUT /api/v1/auth/me` and shows a success toast

#### Scenario: Username collision
- **WHEN** user tries to set a username already taken by another user
- **THEN** the system displays "Ese nombre de usuario ya está en uso"

### Requirement: Account section — view email
The system SHALL display the current email address in the Account section (read-only).

#### Scenario: User views account section
- **WHEN** user opens the Account section
- **THEN** the system displays the current email from `supabase.auth.getUser()`

### Requirement: Account section — change email
The system SHALL allow users to change their email via Supabase Auth, sending a confirmation email to the new address.

#### Scenario: User requests email change
- **WHEN** user enters a new email and submits the form
- **THEN** the system calls `supabase.auth.updateUser({ email: nuevoEmail })` and displays "Te enviamos un email de confirmación a la nueva dirección"

### Requirement: Account section — change password
The system SHALL allow users to change their password while logged in.

#### Scenario: User changes password
- **WHEN** user enters and confirms a new password and submits
- **THEN** the system calls `supabase.auth.updateUser({ password: nuevaPassword })` and shows success

### Requirement: Notifications section — placeholder
The system SHALL display a Notifications section with disabled toggles labeled "Próximamente".

#### Scenario: User views notifications section
- **WHEN** user opens the Notifications section
- **THEN** the system renders toggle switches in a disabled state with "Próximamente" label

### Requirement: Session section — sign out
The system SHALL allow users to sign out from the current session.

#### Scenario: User signs out
- **WHEN** user clicks "Cerrar sesión"
- **THEN** the system calls `supabase.auth.signOut()` and redirects to `/login`

### Requirement: Session section — sign out all devices
The system SHALL allow users to sign out from all devices.

#### Scenario: User signs out all devices
- **WHEN** user clicks "Cerrar sesión en todos los dispositivos"
- **THEN** the system calls `supabase.auth.signOut({ scope: 'global' })` and redirects to `/login`

### Requirement: Danger zone — delete account
The system SHALL allow users to permanently delete their account after email confirmation.

#### Scenario: User deletes account
- **WHEN** user opens the danger zone section, clicks "Eliminar cuenta", confirms by typing their email, and submits
- **THEN** the system calls `DELETE /api/v1/auth/me`, signs out the user, and redirects to `/login` with a confirmation message

#### Scenario: Email mismatch in delete confirmation
- **WHEN** user types a different email than their registered one in the delete confirmation modal
- **THEN** the system displays "El email no coincide con tu cuenta"
