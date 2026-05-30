## ADDED Requirements

### Requirement: Database schema for pet_friendly_places
The system SHALL have a `pet_friendly_places` table in Supabase with UUID primary key, coordinates, category, and metadata fields, plus RLS policies for public read and authenticated insert.

#### Scenario: Table creation
- **WHEN** the migration SQL is applied
- **THEN** table `pet_friendly_places` exists with columns: `id` (UUID, PK, gen_random_uuid()), `nombre` (text, NOT NULL), `categoria` (pet_friendly_category enum), `lat` (float8, NOT NULL), `lng` (float8, NOT NULL), `descripcion` (text), `foto_url` (text), `fuente` (text, NOT NULL), `verificado` (boolean, default false), `created_by` (UUID nullable FK profiles.id), `created_at` (timestamptz, default now()), `updated_at` (timestamptz, default now())
- **AND** a PostgreSQL enum type `pet_friendly_category` exists with values: `cafeteria`, `bar_restaurante`, `hotel`, `experiencia`

#### Scenario: RLS policies
- **WHEN** table is created and RLS is enabled
- **THEN** a SELECT policy exists with `USING (true)` for public read access
- **AND** an INSERT policy exists with `WITH CHECK (true)` for authenticated users (backend validates auth via `get_current_user()`)
