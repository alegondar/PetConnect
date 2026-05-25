## ADDED Requirements

### Requirement: Login page
The frontend SHALL render a LoginPage with email/password form validated by zod.

#### Scenario: Successful login
- **WHEN** user submits valid credentials
- **THEN** the auth store SHALL update and redirect to `/feed`

#### Scenario: Validation errors
- **WHEN** user submits invalid email format
- **THEN** zod SHALL show field-level error messages

### Requirement: Register page
The frontend SHALL render a RegisterPage with email, password, and username fields.

#### Scenario: Successful registration
- **WHEN** user submits valid {email, password, username}
- **THEN** a new account SHALL be created and user redirected to `/feed`

### Requirement: Auth flow
The frontend SHALL redirect authenticated users away from login/register pages.

#### Scenario: Already authenticated
- **WHEN** an authenticated user visits `/login`
- **THEN** they SHALL be redirected to `/feed`
