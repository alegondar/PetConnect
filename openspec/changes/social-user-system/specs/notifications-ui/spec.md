## ADDED Requirements

### Requirement: Notification bell icon with badge
The system SHALL display a bell icon in the header with a badge showing unread notification count.

#### Scenario: No unread notifications
- **WHEN** user has zero unread notifications
- **THEN** the bell icon shows no badge

#### Scenario: Has unread notifications
- **WHEN** user has N unread notifications
- **THEN** the bell icon shows a red badge with the count

### Requirement: Notifications dropdown
The system SHALL show a dropdown when the bell icon is clicked.

#### Scenario: Open dropdown
- **WHEN** user clicks the bell icon
- **THEN** a dropdown appears with the latest 10 notifications, and all unread notifications are marked as read via `PATCH /api/v1/notifications/read`

#### Scenario: New follower notification
- **WHEN** notification type is `new_follower`
- **THEN** the dropdown shows "@username empezó a seguirte"

#### Scenario: New like notification
- **WHEN** notification type is `new_like`
- **THEN** the dropdown shows "@username le dio like a tu post"

#### Scenario: New comment notification
- **WHEN** notification type is `new_comment`
- **THEN** the dropdown shows "@username comentó tu post"

#### Scenario: Empty notifications
- **WHEN** user has no notifications
- **THEN** the dropdown shows "No tenés notificaciones todavía"
