## ADDED Requirements

### Requirement: Tailwind configuration
The frontend SHALL configure Tailwind CSS with the PetConnect color palette as custom tokens.

#### Scenario: Custom colors
- **WHEN** checking `tailwind.config.js`
- **THEN** it SHALL define `colors.primary: #D946EF`, `colors.secondary: #F0ABFC`, `colors.accent: #F59E0B`

### Requirement: API client with Axios
The frontend SHALL have an Axios instance with base URL, JSON defaults, and JWT interceptor.

#### Scenario: JWT interceptor
- **WHEN** the auth store has a token
- **THEN** every request SHALL include `Authorization: Bearer <token>`

#### Scenario: 401 redirect
- **WHEN** the API returns 401
- **THEN** the user SHALL be redirected to `/login` and the token cleared

### Requirement: Auth store with Zustand
The frontend SHALL have a Zustand store managing auth state (token, profile, login, logout).

#### Scenario: Login
- **WHEN** `authStore.login(email, password)` is called
- **THEN** the store SHALL set the token and profile, persisting to localStorage

#### Scenario: Logout
- **WHEN** `authStore.logout()` is called
- **THEN** the store SHALL clear the token and profile

### Requirement: Router with protected routes
The frontend SHALL use React Router v6 with lazy-loaded pages and a ProtectedRoute wrapper.

#### Scenario: Unauthenticated redirect
- **WHEN** an unauthenticated user accesses `/feed`
- **THEN** they SHALL be redirected to `/login`

### Requirement: Layout with bottom navigation
The frontend SHALL have a mobile-first Layout with bottom tab bar and a top header.

#### Scenario: Bottom navigation
- **WHEN** the app renders on mobile
- **THEN** tabs SHALL show: Feed, Ranking, InstaPet, Lost, Profile
