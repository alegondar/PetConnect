## ADDED Requirements

### Requirement: Feed mode toggle in FeedPage
The system SHALL display a toggle with two options at the top of the feed: "Para vos" (global) and "Siguiendo" (following).

#### Scenario: Select "Siguiendo" tab
- **WHEN** user clicks "Siguiendo"
- **THEN** `GET /api/v1/feed?mode=following` is called and posts from followed users are displayed

#### Scenario: No followed users
- **WHEN** user selects "Siguiendo" but follows no one
- **THEN** the page shows "Todavía no seguís a nadie. ¡Explorá usuarios y empezá a seguir!" with a button to `/search`

#### Scenario: Select "Para vos" tab
- **WHEN** user clicks "Para vos"
- **THEN** `GET /api/v1/feed` (default global) is called and all posts are displayed
