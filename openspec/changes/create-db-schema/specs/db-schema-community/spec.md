## ADDED Requirements

### Requirement: Lost pets table
The schema SHALL include a `lost_pets` table with geolocation data.

#### Scenario: Lost pets table structure
- **WHEN** the schema is applied
- **THEN** there SHALL be a `lost_pets` table with: `id UUID PK`, `reporter_id UUID FK REFERENCES profiles(id) NOT NULL`, `name TEXT NOT NULL`, `species TEXT NOT NULL`, `breed TEXT`, `photo_url TEXT`, `last_seen_lat DECIMAL(10,7) NOT NULL`, `last_seen_lng DECIMAL(10,7) NOT NULL`, `last_seen_address TEXT`, `description TEXT`, `status TEXT DEFAULT 'lost' CHECK (status IN ('lost','found'))`, `created_at`, `updated_at`

### Requirement: Adoptions table
The schema SHALL include an `adoptions` table for pet adoption listings.

#### Scenario: Adoptions table structure
- **WHEN** the schema is applied
- **THEN** there SHALL be an `adoptions` table with: `id UUID PK`, `pet_id UUID FK REFERENCES pets(id) ON DELETE CASCADE`, `owner_id UUID FK REFERENCES profiles(id) NOT NULL`, `adopter_id UUID FK REFERENCES profiles(id)`, `status TEXT DEFAULT 'available' CHECK (status IN ('available','pending','adopted'))`, `description TEXT`, `created_at`, `updated_at`

### Requirement: Lost pets RLS
The schema SHALL enable RLS on `lost_pets` allowing public read but only reporter update.

#### Scenario: Public can read lost pets
- **WHEN** an authenticated user queries `lost_pets`
- **THEN** all rows SHALL be visible

#### Scenario: Only reporter can modify
- **WHEN** a user updates a lost pet report
- **THEN** the operation SHALL succeed only if `reporter_id` matches `auth.uid()`

### Requirement: Adoptions RLS
The schema SHALL enable RLS on `adoptions` with owner-only write access.

#### Scenario: Adoptions visibility
- **WHEN** an authenticated user queries `adoptions`
- **THEN** all rows with status 'available' or 'pending' SHALL be visible

#### Scenario: Owner manages adoptions
- **WHEN** the pet owner creates or updates an adoption listing
- **THEN** the operation SHALL succeed only if `owner_id` matches `auth.uid()`
