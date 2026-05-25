## ADDED Requirements

### Requirement: RLS policies resolve owner via profiles table
All Row Level Security policies on tables that reference `profiles(id)` via FK SHALL verify ownership by joining through the `profiles` table to match `profiles.user_id` with `auth.uid()`, instead of comparing `auth.uid()` directly to the FK column.

#### Scenario: Owner inserts a pet
- **WHEN** a user with `auth.uid() = "abc-123"` has profile with `id = "xyz-789"` and `user_id = "abc-123"`, and attempts to INSERT a pet with `owner_id = "xyz-789"`
- **THEN** the RLS policy resolves `profiles.id = "xyz-789"` → `profiles.user_id = "abc-123"` → matches `auth.uid()` → INSERT succeeds

#### Scenario: Non-owner tries to insert someone else's pet
- **WHEN** a user with `auth.uid() = "other-456"` attempts to INSERT a pet with `owner_id = "xyz-789"` (belonging to user "abc-123")
- **THEN** the RLS policy resolves `profiles.id = "xyz-789"` → `profiles.user_id = "abc-123"` → does NOT match `auth.uid() = "other-456"` → INSERT rejected

#### Scenario: Owner deletes their pet
- **WHEN** the owner of a pet (verified through profiles subquery) attempts to DELETE the pet
- **THEN** the RLS policy allows the DELETE operation

### Requirement: All affected tables have corrected RLS
The following tables SHALL have their RLS INSERT/UPDATE/DELETE policies corrected to use the profiles subquery pattern: `pets`, `posts`, `likes`, `comments`, `lost_pets`, `adoptions`, `instapet_posts`, `instapet_followers`.

#### Scenario: Insert into any affected table as owner
- **WHEN** an authenticated user inserts a row into any affected table with the FK column set to their own `profiles.id`
- **THEN** the RLS check resolves the `profiles.user_id = auth.uid()` mapping and allows the operation

#### Scenario: Insert into affected table as non-owner
- **WHEN** an authenticated user attempts to insert a row with an FK column pointing to another user's `profiles.id`
- **THEN** the RLS check fails because `profiles.user_id` does not match `auth.uid()` and the operation is rejected

### Requirement: Dependent tables use nested subquery
Tables that verify ownership through a parent table (e.g., `vet_visits` checks `pets.owner_id`) SHALL use a nested subquery through both the parent table and `profiles`.

#### Scenario: Owner creates a vet visit for their pet
- **WHEN** the owner of a pet inserts a vet visit row, and the RLS policy checks `pets.owner_id` through the profiles join
- **THEN** the operation succeeds because `profiles.user_id` matches `auth.uid()` via the pet's owner

#### Scenario: Non-owner tries to create a vet visit
- **WHEN** a non-owner attempts to insert a vet visit for a pet they don't own
- **THEN** the RLS policy rejects the operation because the profiles join does not match `auth.uid()`
