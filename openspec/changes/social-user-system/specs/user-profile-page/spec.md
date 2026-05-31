## ADDED Requirements

### Requirement: User profile page
The system SHALL provide a `UserProfilePage` at `/profile/:userId` showing a user's public profile.

#### Scenario: View another user's profile
- **WHEN** user navigates to `/profile/:userId`
- **THEN** the page displays: large circular avatar, username, full_name, bio, post/follower/following counts, a FollowButton, and a 3-column grid of the user's posts

#### Scenario: View own profile
- **WHEN** user navigates to their own profile
- **THEN** instead of FollowButton, an "Editar perfil" button is shown linking to `/settings`

#### Scenario: No posts
- **WHEN** the user has zero posts
- **THEN** the grid area shows "Todavía no hay publicaciones"

#### Scenario: Click on a post
- **WHEN** user clicks a post in the grid
- **THEN** a modal opens showing the full PostCard (photo, description, likes, comments)

#### Scenario: Click follower count
- **WHEN** user clicks the followers count
- **THEN** a FollowersModal opens showing the list of followers

#### Scenario: Click following count
- **WHEN** user clicks the following count
- **THEN** a FollowingModal opens showing the list of followed users
