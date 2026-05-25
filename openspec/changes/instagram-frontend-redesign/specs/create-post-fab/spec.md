## ADDED Requirements

### Requirement: FAB button for creating new post
The system SHALL render a Floating Action Button (FAB) as a 56px diameter circle with `bg-[#D946EF]` background, white Plus icon (lucide-react), positioned fixed at the bottom-right of the content area, with `shadow-lg` elevation.

#### Scenario: User is on Feed screen
- **WHEN** the user is viewing the Feed
- **THEN** a 56px circular magenta button with a white "+" icon is visible at the bottom-right of the screen

#### Scenario: User taps FAB
- **WHEN** the user taps the FAB button
- **THEN** the system navigates to the Create Post screen or opens a create post modal/dialog

### Requirement: FAB positioning
The system SHALL position the FAB `fixed` with `bottom: 80px` (above the bottom nav) and aligned to the right edge of the content container. On viewports wider than 430px, the FAB MUST be positioned relative to the centered 430px container, not the viewport edge.

#### Scenario: On mobile (375px width)
- **WHEN** the viewport is 375px wide
- **THEN** the FAB is positioned at `right: 16px`, `bottom: 80px`

#### Scenario: On desktop (>430px width)
- **WHEN** the viewport is wider than 430px
- **THEN** the FAB is positioned at the right edge of the 430px centered container, `bottom: 80px`

### Requirement: FAB hover and active states
The system SHALL apply a slightly darker background (`#C026D3`) on hover (desktop) and a scale-down transform (`scale-95`) on active press for tactile feedback.

#### Scenario: User hovers over FAB on desktop
- **WHEN** the user hovers the cursor over the FAB
- **THEN** the background color changes to #C026D3 with a smooth transition

#### Scenario: User presses FAB on touch device
- **WHEN** the user touches the FAB
- **THEN** the button scales down to 95% of its original size while pressed
