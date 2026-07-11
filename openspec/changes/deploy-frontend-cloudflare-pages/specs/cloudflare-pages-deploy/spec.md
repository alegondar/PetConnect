## ADDED Requirements

### Requirement: Frontend uses VITE_API_URL for backend base URL in production
The frontend SHALL use the `VITE_API_URL` environment variable as the base URL for API requests when defined. When `VITE_API_URL` is not defined, the frontend SHALL fall back to the relative path `/api/v1`.

#### Scenario: Production build uses VITE_API_URL
- **WHEN** `VITE_API_URL` is set to `https://petconnect-backend.osama-petconnet.workers.dev/api/v1` in `.env.production`
- **AND** the frontend is built with `npm run build`
- **THEN** all API requests use `https://petconnect-backend.osama-petconnet.workers.dev/api/v1` as the base URL

#### Scenario: Development mode uses proxy
- **WHEN** `VITE_API_URL` is NOT defined in `.env` or `.env.development`
- **AND** the dev server is started with `npm run dev`
- **THEN** all API requests use the relative path `/api/v1` and are proxied to `http://localhost:8000`

### Requirement: .env.production contains production configuration
The frontend SHALL have a `.env.production` file with the `VITE_API_URL` variable pointing to the production backend.

#### Scenario: .env.production is loaded on build
- **WHEN** `npm run build` is executed in the frontend directory
- **THEN** Vite SHALL automatically load variables from `.env.production`
- **AND** `import.meta.env.VITE_API_URL` SHALL resolve to the value in `.env.production`

### Requirement: Existing .env file remains unchanged
The existing `.env` file SHALL NOT be modified. It SHALL continue to contain only Supabase configuration variables.

#### Scenario: Dev environment unchanged
- **WHEN** `npm run dev` is executed after this change
- **THEN** the development experience SHALL be identical to before the change
- **AND** the Vite proxy SHALL continue routing `/api` to `http://localhost:8000`
