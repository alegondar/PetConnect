## ADDED Requirements

### Requirement: Posts table
The schema SHALL include a `posts` table for the pet feed.

#### Scenario: Posts table structure
- **WHEN** the schema is applied
- **THEN** there SHALL be a `posts` table with: `id UUID PK`, `author_id UUID FK REFERENCES profiles(id) NOT NULL`, `pet_id UUID FK REFERENCES pets(id) ON DELETE CASCADE`, `content TEXT`, `photo_url TEXT`, `likes_count INTEGER DEFAULT 0`, `comments_count INTEGER DEFAULT 0`, `created_at`, `updated_at`

### Requirement: Likes table
The schema SHALL include a `likes` table with a unique constraint per user per post.

#### Scenario: Likes table structure
- **WHEN** the schema is applied
- **THEN** there SHALL be a `likes` table with: `id UUID PK`, `user_id UUID FK REFERENCES profiles(id) NOT NULL`, `post_id UUID FK REFERENCES posts(id) ON DELETE CASCADE`, `created_at`, and a UNIQUE constraint on `(user_id, post_id)`

### Requirement: Comments table
The schema SHALL include a `comments` table for post comments.

#### Scenario: Comments table structure
- **WHEN** the schema is applied
- **THEN** there SHALL be a `comments` table with: `id UUID PK`, `user_id UUID FK REFERENCES profiles(id) NOT NULL`, `post_id UUID FK REFERENCES posts(id) ON DELETE CASCADE`, `content TEXT NOT NULL`, `created_at`, `updated_at`

### Requirement: Likes count trigger
The schema SHALL include triggers to update `likes_count` and `comments_count` on `posts` when likes and comments are inserted or deleted.

#### Scenario: Like increments counter
- **WHEN** a like is inserted for a post
- **THEN** `posts.likes_count` SHALL be incremented by 1

#### Scenario: Unlike decrements counter
- **WHEN** a like is deleted for a post
- **THEN** `posts.likes_count` SHALL be decremented by 1

### Requirement: Weekly ranking view
The schema SHALL include a materialized view `weekly_ranking` ranking pets by likes received in the last 7 days.

#### Scenario: Weekly ranking structure
- **WHEN** the schema is applied
- **THEN** there SHALL be a materialized view `weekly_ranking` with: `pet_id`, `pet_name`, `pet_photo_url`, `owner_username`, `likes_this_week`, `rank`, `updated_at`

### Requirement: Social RLS policies
The schema SHALL enable RLS on `posts`, `likes`, and `comments`.

#### Scenario: Public read access to posts
- **WHEN** an authenticated user queries `posts`
- **THEN** all posts SHALL be visible (public feed)

#### Scenario: Users manage own likes and comments
- **WHEN** a user inserts or deletes a like or comment
- **THEN** the operation SHALL succeed only if `user_id` matches `auth.uid()`
