## ADDED Requirements

### Requirement: Pets table
The schema SHALL include a `pets` table for user-owned pets.

#### Scenario: Pets table structure
- **WHEN** the schema is applied
- **THEN** there SHALL be a `pets` table with: `id UUID PK`, `owner_id UUID FK REFERENCES profiles(id) NOT NULL`, `name TEXT NOT NULL`, `species TEXT NOT NULL`, `breed TEXT`, `age INTEGER`, `weight DECIMAL(5,2)`, `photo_url TEXT`, `bio TEXT`, `created_at`, `updated_at`

### Requirement: Vet visits table
The schema SHALL include a `vet_visits` table to track veterinary appointments.

#### Scenario: Vet visits table structure
- **WHEN** the schema is applied
- **THEN** there SHALL be a `vet_visits` table with: `id UUID PK`, `pet_id UUID FK REFERENCES pets(id) ON DELETE CASCADE`, `vet_name TEXT NOT NULL`, `visit_date DATE NOT NULL`, `reason TEXT NOT NULL`, `notes TEXT`, `created_at`, `updated_at`

### Requirement: Pet events table
The schema SHALL include a `pet_events` table for InstaPet (health tracking events).

#### Scenario: Pet events table structure
- **WHEN** the schema is applied
- **THEN** there SHALL be a `pet_events` table with: `id UUID PK`, `pet_id UUID FK REFERENCES pets(id) ON DELETE CASCADE`, `event_type TEXT NOT NULL` (CHECK IN 'vaccination','weight','deworming','medication','other'), `event_date DATE NOT NULL`, `value TEXT`, `notes TEXT`, `created_at`, `updated_at`

### Requirement: Pets RLS policies
The schema SHALL enable RLS on `pets`, `vet_visits`, and `pet_events`.

#### Scenario: Owner can CRUD their own pets
- **WHEN** the authenticated user queries pet-related tables
- **THEN** they SHALL only see and modify rows where `owner_id` (or `pet.owner_id`) matches `auth.uid()`
