## ADDED Requirements

### Requirement: Profiles table
The schema SHALL include a `profiles` table linked to `auth.users` from Supabase Auth.

#### Scenario: Profiles table structure
- **WHEN** the schema is applied
- **THEN** there SHALL be a `profiles` table with columns: `id UUID PK`, `user_id UUID FK REFERENCES auth.users(id) UNIQUE NOT NULL`, `username TEXT UNIQUE NOT NULL`, `avatar_url TEXT`, `bio TEXT`, `created_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ`

### Requirement: Auto-create profile on signup
The schema SHALL include a trigger function that creates a profile row when a new user is inserted into `auth.users`.

#### Scenario: New user gets a profile
- **WHEN** a row is inserted into `auth.users`
- **THEN** a corresponding row SHALL be created in `profiles` with `username` set to a default derived from the user's email

### Requirement: Profiles RLS policies
The schema SHALL enable Row Level Security on the `profiles` table.

#### Scenario: User can read any profile
- **WHEN** a user queries `profiles`
- **THEN** all rows SHALL be visible (public read access)

#### Scenario: User can update own profile
- **WHEN** a user updates their own profile row
- **THEN** the update SHALL succeed if `user_id` matches `auth.uid()`
