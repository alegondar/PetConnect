## ADDED Requirements

### Requirement: Global color palette defined in Tailwind config
The system SHALL extend the Tailwind CSS theme with the following custom colors: `primary: #D946EF`, `primary-hover: #C026D3`, `secondary: #F0ABFC`, `accent: #F59E0B`, `background: #F9FAFB`, and `foreground: #111827`. These colors MUST be accessible via Tailwind utility classes (e.g., `text-primary`, `bg-background`).

#### Scenario: Developer uses primary color
- **WHEN** a component uses `className="text-primary"`
- **THEN** the text renders in color #D946EF

#### Scenario: Developer uses background color
- **WHEN** the main layout uses `className="bg-background"`
- **THEN** the background renders in color #F9FAFB

### Requirement: Mobile-first max-width container
The system SHALL provide a `max-w-mobile` utility class set to 430px, and the main layout container MUST use `max-w-mobile mx-auto` to center content on wider viewports.

#### Scenario: Viewing on a 1440px wide monitor
- **WHEN** the user opens the app on a desktop browser
- **THEN** the content is centered in a 430px wide column with #F9FAFB background filling the sides

#### Scenario: Viewing on a 375px wide phone
- **WHEN** the user opens the app on a mobile device
- **THEN** the content occupies the full 375px viewport width

### Requirement: Body background and font
The system SHALL set the document body to `bg-[#F9FAFB]` (background color) and apply a clean sans-serif font stack (`Inter` or system default) with `text-[#111827]` as the default text color via `index.css`.

#### Scenario: App loads
- **WHEN** the application renders for the first time
- **THEN** the body background is #F9FAFB and all text renders in #111827 using the sans-serif font stack

### Requirement: Header with PetConnect logo
The system SHALL render a simple top header bar with the text "PetConnect" in `text-primary` (#D946EF), `font-bold`, `text-xl`, centered horizontally. The header background MUST be white with a subtle bottom border (`border-b border-gray-100`).

#### Scenario: User views any main screen
- **WHEN** the user is on the Feed, Ranking, Perdidos, or Mis Pets screen
- **THEN** a white header bar is visible at the top with "PetConnect" in magenta, centered

### Requirement: Card styling
The system SHALL style all card components (posts, ranking entries, lost pet cards, pet cards) with `rounded-xl` corners and `shadow-sm` elevation, using `bg-white` background.

#### Scenario: Post card renders
- **WHEN** a post card is displayed in the feed
- **THEN** the card has rounded-xl corners, a subtle shadow-sm, and white background

#### Scenario: Ranking card renders
- **WHEN** a ranking entry card is displayed
- **THEN** the card has rounded-xl corners, a subtle shadow-sm, and white background
