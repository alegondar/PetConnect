## ADDED Requirements

### Requirement: Search icon in header
The Layout component SHALL display a search (magnifying glass) icon in the header for authenticated users that navigates to `/search`.

#### Scenario: Click search icon
- **WHEN** user clicks the search icon in the header
- **THEN** the app navigates to `/search`

### Requirement: Notification bell in header
The Layout component SHALL display a bell icon with unread notification badge in the header for authenticated users.

#### Scenario: Click bell icon
- **WHEN** user clicks the bell icon
- **THEN** the NotificationsDropdown opens
