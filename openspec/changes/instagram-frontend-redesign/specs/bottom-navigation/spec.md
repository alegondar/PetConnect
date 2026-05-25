## ADDED Requirements

### Requirement: Bottom navigation bar with four sections
The system SHALL render a floating bottom navigation bar with four icon-labeled sections: Feed (Home icon), Ranking (Trophy icon), Perdidos (MapPin icon), and Mis Pets (PawPrint icon). The bar MUST be fixed at the bottom of the viewport with horizontal centering, white background, rounded-2xl corners, and a soft shadow.

#### Scenario: User is on any authenticated screen
- **WHEN** the user is logged in and viewing any main screen
- **THEN** the bottom nav bar is visible, fixed at the bottom, with the active section's icon in #D946EF and label in #111827, and inactive sections in #9CA3AF

#### Scenario: User taps a nav item
- **WHEN** the user taps "Ranking" in the bottom nav
- **THEN** the system navigates to the Ranking screen, the Trophy icon turns #D946EF, and the previously active icon turns #9CA3AF

### Requirement: Bottom nav styling
The system SHALL style the bottom navigation bar with `bg-white`, `rounded-2xl`, `shadow-lg`, horizontal padding of 16px, vertical padding of 8px, and a 16px margin from the bottom edge of the viewport. The bar MUST be centered horizontally with `mx-auto` and constrained to the container width (max 430px).

#### Scenario: Viewing on mobile (375px width)
- **WHEN** the viewport is 375px wide
- **THEN** the bottom nav spans the full viewport width minus 32px (16px margin each side), with rounded-2xl corners

#### Scenario: Viewing on desktop (>430px)
- **WHEN** the viewport is wider than 430px
- **THEN** the bottom nav is constrained to 430px width, centered horizontally, with the same floating style

### Requirement: Feed is the default active tab
The system SHALL set the Feed (Home icon) as the active tab by default when the user first loads the app after authentication.

#### Scenario: User logs in
- **WHEN** the user completes authentication
- **THEN** the system navigates to the Feed screen and the Home icon in the bottom nav is rendered in #D946EF

### Requirement: Bottom nav does not overlap content
The system SHALL ensure all scrollable content has sufficient bottom padding (at least 80px) to prevent the bottom nav from obscuring the last items in any list or feed.

#### Scenario: User scrolls to the bottom of the feed
- **WHEN** the user reaches the last post in the feed
- **THEN** the last post is fully visible above the bottom nav bar without being obscured
