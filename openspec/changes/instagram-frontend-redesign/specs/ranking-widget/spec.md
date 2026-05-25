## REMOVED Requirements

### Requirement: Ranking widget on home screen
**Reason**: The ranking widget displayed as a sidebar or inline section on the home/feed screen is removed. Ranking is now a first-class navigation destination accessible from the bottom nav bar, giving it its own dedicated full screen.

**Migration**: The ranking data is still fetched from `GET /ranking`. Instead of rendering a compact widget on the home screen, the Ranking screen (`/ranking` route) renders the full ranking list as a standalone view. Users access it via the Trophy icon in the bottom navigation bar. No API changes required.

## ADDED Requirements

### Requirement: Ranking as standalone screen
The system SHALL render the ranking as a full-screen view at the `/ranking` route, accessible via the Trophy icon in the bottom navigation bar. The ranking screen MUST display the list of top pets sorted by weekly likes in descending order.

#### Scenario: User navigates to Ranking via bottom nav
- **WHEN** the user taps the Trophy icon in the bottom nav
- **THEN** the system navigates to `/ranking` and renders the full ranking list with pet avatars, names, owner usernames, and weekly like counts

#### Scenario: Ranking data loads successfully
- **WHEN** the ranking API returns a list of ranked pets
- **THEN** each ranking entry displays rank number, pet photo (circular avatar), pet name, owner username, and a like count badge

### Requirement: Ranking accent color
The system SHALL use the accent color #F59E0B (amber) for trophy icons, rank badges, and the active Ranking nav icon to visually distinguish the ranking feature.

#### Scenario: Ranking screen is active
- **WHEN** the user is viewing the Ranking screen
- **THEN** the Trophy icon in the bottom nav renders in #F59E0B and the top 3 rank badges use amber/gold styling
