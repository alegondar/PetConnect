## MODIFIED Requirements

### Requirement: My pets page
The frontend SHALL render a MyPetsPage listing the authenticated user's pets with add/edit/delete. The page SHALL fetch pets from `GET /api/v1/my-pets` (authenticated endpoint) to ensure data isolation.

#### Scenario: List user's pets
- **WHEN** user visits `/my-pets`
- **THEN** the frontend SHALL call `GET /api/v1/my-pets` with the user's JWT token
- **THEN** only pets owned by the authenticated user SHALL be displayed as cards with photo, name, species

#### Scenario: Add pet
- **WHEN** user fills the create pet form and submits
- **THEN** the new pet SHALL appear in the list

### Requirement: My pets cache cleared on session change
The frontend SHALL clear the React Query cache when a user logs out or logs in, to prevent cross-user data leaks.

#### Scenario: Cache cleared on logout
- **WHEN** user clicks "Cerrar sesión"
- **THEN** the React Query cache SHALL be cleared with `queryClient.clear()`

#### Scenario: Cache cleared on login
- **WHEN** user successfully logs in
- **THEN** the React Query cache SHALL be cleared with `queryClient.clear()` before navigating to the feed

---

## ADDED Requirements

### Requirement: Components use my-pets endpoint
All frontend components that display the current user's pets SHALL use the `GET /api/v1/my-pets` endpoint instead of the public `GET /api/v1/pets` endpoint.

#### Scenario: CreatePostModal fetches user's pets
- **WHEN** CreatePostModal opens to let user select a pet for a post
- **THEN** it SHALL call `GET /api/v1/my-pets` to fetch only the current user's pets

#### Scenario: AdoptionsPage fetches user's pets
- **WHEN** AdoptionForm renders the pet selector dropdown
- **THEN** it SHALL call `GET /api/v1/my-pets` to fetch only the current user's pets

#### Scenario: FeedPage pet stories bar fetches user's pets
- **WHEN** FeedPage shows the horizontal pet stories bar
- **THEN** it SHALL call `GET /api/v1/my-pets` to fetch only the current user's pets
