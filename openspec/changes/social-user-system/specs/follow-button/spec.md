## ADDED Requirements

### Requirement: Follow button component
The system SHALL provide a reusable `FollowButton` component.

#### Scenario: Not following — show follow
- **WHEN** `initialIsFollowing` is false
- **THEN** the button shows "Seguir" with solid violet background (#D946EF)

#### Scenario: Following — show unfollow on hover
- **WHEN** `initialIsFollowing` is true
- **THEN** the button shows "Siguiendo" with outline style; on hover it changes to "Dejar de seguir" in red

#### Scenario: Click to follow
- **WHEN** user clicks "Seguir"
- **THEN** POST `/api/v1/users/:userId/follow` is called, button state changes to following, `onFollowChange(true)` is called

#### Scenario: Click to unfollow
- **WHEN** user clicks "Dejar de seguir"
- **THEN** DELETE `/api/v1/users/:userId/follow` is called, button state changes to not following, `onFollowChange(false)` is called

#### Scenario: Loading state
- **WHEN** the API call is in progress
- **THEN** the button shows a spinner and is disabled
