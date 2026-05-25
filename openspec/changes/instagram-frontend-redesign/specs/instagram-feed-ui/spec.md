## ADDED Requirements

### Requirement: Feed displays posts with full-width photo
The system SHALL render each post in the feed with the post photo occupying the full width of the content container (max 430px), with `aspect-ratio` preserving the original image proportions.

#### Scenario: Feed loads with posts
- **WHEN** the user opens the Feed screen
- **THEN** each post displays its photo at full container width with the image maintaining its natural aspect ratio

#### Scenario: Post has no photo
- **WHEN** a post has no `photo_url`
- **THEN** the system renders a placeholder with the primary color (#D946EF) as background and a paw icon centered

### Requirement: Avatar and pet info displayed on post
The system SHALL display the pet's avatar as a circular image (40px diameter) at the top-left of each post card, with the pet name and breed to the right of the avatar. The avatar MUST use the pet's `photo_url` with a fallback to a colored initial circle.

#### Scenario: Post with pet that has photo
- **WHEN** the pet has a `photo_url`
- **THEN** the system renders a 40px circular avatar image beside the pet name and breed

#### Scenario: Post with pet without photo
- **WHEN** the pet has no `photo_url`
- **THEN** the system renders a 40px circular placeholder with the first letter of the pet's name on a #D946EF background

### Requirement: Like and comment action buttons below photo
The system SHALL render a Heart icon and a MessageCircle icon below each post photo, horizontally aligned with 16px gap. The Heart icon MUST toggle between outline (not liked) and filled #D946EF (liked) states. The MessageCircle icon MUST navigate to the post comments view.

#### Scenario: User taps like on an unliked post
- **WHEN** the user taps the Heart (outline) icon
- **THEN** the system calls `POST /feed/{post_id}/like`, the icon changes to filled #D946EF, and the likes count increments by 1

#### Scenario: User taps like on an already liked post
- **WHEN** the user taps the Heart (filled) icon
- **THEN** the system calls `DELETE /feed/{post_id}/like`, the icon changes to outline, and the likes count decrements by 1

#### Scenario: User taps comment icon
- **WHEN** the user taps the MessageCircle icon
- **THEN** the system navigates to the post detail/comments view

### Requirement: Likes count displayed below action buttons
The system SHALL display the number of likes for each post as bold text (`font-semibold`) below the action buttons, formatted as "X likes" (e.g., "15 likes").

#### Scenario: Post has likes
- **WHEN** a post has `likes_count: 15`
- **THEN** the system renders "15 likes" in bold text below the action buttons

#### Scenario: Post has zero likes
- **WHEN** a post has `likes_count: 0`
- **THEN** the system renders "0 likes" in bold text below the action buttons

### Requirement: Spacing between posts
The system SHALL apply a 24px vertical gap between consecutive post cards in the feed to ensure a clean, uncluttered visual separation.

#### Scenario: Feed with multiple posts
- **WHEN** the feed contains 3 or more posts
- **THEN** each post card is separated from the next by 24px of vertical space
