## ADDED Requirements

### Requirement: Clickable author in PostCard
The PostCard component SHALL make the author's avatar and username clickable, navigating to their profile.

#### Scenario: Click avatar
- **WHEN** user clicks the author's avatar circle in a PostCard
- **THEN** the app navigates to `/profile/:authorId`

#### Scenario: Click username
- **WHEN** user clicks the author's username in a PostCard
- **THEN** the app navigates to `/profile/:authorId`

#### Scenario: Existing functionality preserved
- **WHEN** user clicks like, comment, or other action buttons
- **THEN** the existing like/comment/edit/delete behavior is unchanged
