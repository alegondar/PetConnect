## ADDED Requirements

### Requirement: InstaPet profile page
The frontend SHALL render a pet's InstaPet profile with posts grid, follow button, and milestones.

#### Scenario: View InstaPet profile
- **WHEN** user visits `/instapet/:petId`
- **THEN** the pet's InstaPet posts, follower count, and milestones SHALL be displayed

#### Scenario: Follow/unfollow
- **WHEN** user taps Follow on a pet they don't follow
- **THEN** the follower count SHALL increment and button change to Following

### Requirement: InstaPet post creation
The frontend SHALL allow posting to a pet's InstaPet profile with photo/video URL and description.

#### Scenario: Create InstaPet post
- **WHEN** the pet owner submits a new post
- **THEN** it SHALL appear in the pet's profile grid

### Requirement: Milestones
The frontend SHALL display and allow adding milestones on a pet's profile.

#### Scenario: Add milestone
- **WHEN** the pet owner adds a milestone with title, date, photo
- **THEN** it SHALL appear in the milestones timeline

### Requirement: Following page
The frontend SHALL render a page listing pets the current user follows.

#### Scenario: List followed pets
- **WHEN** user visits `/following`
- **THEN** followed pets SHALL be displayed with name, photo, species
