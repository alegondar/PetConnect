## ADDED Requirements

### Requirement: Service type ENUMs
The database SHALL define `service_type` ENUM with values `paseador`, `cuidador`, `veterinario`, `peluqueria` and `service_status` ENUM with values `activo`, `pausado`, `cerrado`.

#### Scenario: ENUM creation
- **WHEN** the migration SQL is executed
- **THEN** both ENUM types are created in the public schema

### Requirement: Service offers table
The database SHALL have a `service_offers` table with columns: `id` (uuid PK), `provider_id` (FK → profiles.id), `service_type`, `title`, `description`, `price_from`, `price_to`, `price_unit`, `location`, `lat`, `lng`, `available_days` (text[]), `photo_url`, `status`, `created_at`, `updated_at`. Indexes on `provider_id`, `service_type`, `status`.

#### Scenario: Insert offer
- **WHEN** a user creates a service offer
- **THEN** the row is inserted with `provider_id` = their profiles.id and `status` = 'activo'

### Requirement: Service requests table
The database SHALL have a `service_requests` table with columns: `id` (uuid PK), `requester_id` (FK → profiles.id), `service_type`, `title`, `description`, `pet_id` (FK → pets.id nullable), `frequency_per_week`, `start_date`, `end_date`, `location`, `lat`, `lng`, `status`, `created_at`, `updated_at`. Indexes on `requester_id`, `service_type`, `status`.

#### Scenario: Insert request with pet
- **WHEN** a user creates a service request with `pet_id` set
- **THEN** the row stores the reference to their pet

### Requirement: Service contacts table
The database SHALL have a `service_contacts` table with columns: `id` (uuid PK), `request_id` (nullable FK → service_requests.id), `offer_id` (nullable FK → service_offers.id), `sender_id` (FK → profiles.id), `receiver_id` (FK → profiles.id), `message`, `created_at`. A CHECK constraint SHALL ensure either `request_id` or `offer_id` is NOT NULL.

#### Scenario: Contact about an offer
- **WHEN** user A contacts user B about an offer
- **THEN** a row is inserted with `offer_id` populated and `request_id` NULL

#### Scenario: Contact about a request
- **WHEN** user A contacts user B about a request
- **THEN** a row is inserted with `request_id` populated and `offer_id` NULL

### Requirement: RLS policies
All three tables SHALL use `WITH CHECK (true)` / `USING (true)` RLS policies for compatibility with supabase-py service role.

#### Scenario: Insert bypasses RLS
- **WHEN** the Python backend inserts into any services table using the service key
- **THEN** no RLS violation error (42501) occurs

### Requirement: Contact notification trigger
The database SHALL have a trigger that inserts a `notifications` row with type `service_contact` when a new row is inserted into `service_contacts`.

#### Scenario: Notification on contact
- **WHEN** a service_contact row is inserted
- **THEN** a notification row is created for `receiver_id` with type `service_contact` and data containing `sender_id`, `request_id`/`offer_id`, and a message preview (first 80 chars)

### Requirement: Updated_at triggers
Both `service_offers` and `service_requests` SHALL auto-update `updated_at` on row modification via triggers.

#### Scenario: Update triggers
- **WHEN** a row in service_offers or service_requests is updated
- **THEN** the `updated_at` column is set to `now()`
