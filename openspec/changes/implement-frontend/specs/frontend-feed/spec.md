## ADDED Requirements

### Requirement: Feed page
The frontend SHALL render a FeedPage with infinite-scroll post list using React Query.

#### Scenario: Load feed
- **WHEN** user visits `/feed`
- **THEN** posts SHALL load with author name, pet name, photo, likes_count, comments_count

#### Scenario: Like a post
- **WHEN** user taps the heart icon on a post
- **THEN** the like SHALL be sent to the API and the UI updated optimistically

### Requirement: Create post
The frontend SHALL have a create post form with pet selector, photo URL input, and content textarea.

#### Scenario: Create post
- **WHEN** user selects a pet and submits content
- **THEN** the post SHALL appear at the top of the feed

### Requirement: Post detail and comments
The frontend SHALL render post detail with comments list and comment input.

#### Scenario: View comments
- **WHEN** user taps on a post
- **THEN** a detail view SHALL show the full post with comments

#### Scenario: Add comment
- **WHEN** user types a comment and submits
- **THEN** the comment SHALL appear in the list
