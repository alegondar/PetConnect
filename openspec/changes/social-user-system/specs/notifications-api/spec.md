## ADDED Requirements

### Requirement: Get notifications
The system SHALL expose `GET /api/v1/notifications` returning the latest 20 notifications for the authenticated user.

#### Scenario: Get notifications
- **WHEN** authenticated user requests notifications
- **THEN** the response includes an array of notifications with `id`, `type`, `data`, `read_at`, `created_at`, ordered by `created_at DESC`, limited to 20

#### Scenario: Unauthenticated
- **WHEN** request is made without a valid JWT
- **THEN** 401 Unauthorized is returned

### Requirement: Mark notifications as read
The system SHALL expose `PATCH /api/v1/notifications/read` to mark all unread notifications as read.

#### Scenario: Mark all read
- **WHEN** authenticated user sends PATCH
- **THEN** all notifications for that user where `read_at IS NULL` are updated to `now()`, returns `{ "read": <count> }`

### Requirement: Notifications table
The system SHALL have a `notifications` table with columns: `id` (uuid PK), `user_id` (uuid, the receiver), `type` (text: 'new_follower', 'new_like', 'new_comment'), `data` (jsonb), `read_at` (timestamptz nullable), `created_at` (timestamptz).
