## ADDED Requirements

### Requirement: Followers modal
The system SHALL provide a `FollowersModal` component showing a scrollable list of followers.

#### Scenario: Open followers modal
- **WHEN** user clicks the followers count on a profile
- **THEN** a modal opens with a list of follower profiles (avatar, username, full_name, FollowButton)

#### Scenario: Search within followers
- **WHEN** user types in the search input inside the modal
- **THEN** the list filters to matching usernames or full_names

#### Scenario: Close modal
- **WHEN** user clicks the X button or outside the modal
- **THEN** the modal closes

### Requirement: Following modal
The system SHALL provide a `FollowingModal` component with the same behavior as FollowersModal but showing followed users.
