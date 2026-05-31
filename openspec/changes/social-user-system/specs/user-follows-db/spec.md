## ADDED Requirements

### Requirement: User follows table
The system SHALL have a `user_follows` table tracking follow relationships between users, with automatic counter updates on profiles.

#### Scenario: User follows another user
- **WHEN** a row is inserted into `user_follows`
- **THEN** the `followers_count` of the followed user increments by 1 AND the `following_count` of the follower increments by 1

#### Scenario: User unfollows
- **WHEN** a row is deleted from `user_follows`
- **THEN** the `followers_count` of the unfollowed user decrements by 1 AND the `following_count` of the former follower decrements by 1

#### Scenario: Self-follow prevented
- **WHEN** an INSERT attempts `follower_id = following_id`
- **THEN** the database rejects it with a CHECK constraint violation

#### Scenario: Duplicate follow prevented
- **WHEN** an INSERT attempts a pair that already exists
- **THEN** the database rejects it with a UNIQUE constraint violation

### Requirement: Follow notification trigger
The system SHALL create a notification when a user is followed.

#### Scenario: New follower notification
- **WHEN** a row is inserted into `user_follows`
- **THEN** a row is inserted into `notifications` with `type = 'new_follower'` and `data` containing the follower's profile ID

### Requirement: Profile counters columns
The `profiles` table SHALL include `followers_count` and `following_count` columns defaulting to 0.
