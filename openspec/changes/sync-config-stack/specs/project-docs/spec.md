## ADDED Requirements

### Requirement: IDEA.md must declare backend folder rules

`IDEA.md` SHALL include a section titled `## Reglas de carpetas de backend (crítico)` that explicitly states:

- `backend/` is DEPRECATED since 2026-05-31 (FastAPI legacy). Agents MUST NEVER modify it or use it as reference.
- `backend-node/` is the ACTIVE DEVELOPMENT backend (Hono + TypeScript). Any request to "fix/add something in the backend" without further clarification SHALL target this folder.
- `backend-worker/` is a copy for Cloudflare Workers testing. Agents MUST NEVER touch it unless the user explicitly says "backend-worker", "Cloudflare", "Workers", or "deploy".
- `wrangler deploy` or `wrangler pages deploy` MUST NEVER be executed without an explicit request in the same message.
- If the target backend is ambiguous, the agent SHALL ask before modifying anything.
- `.env`, `.env.production`, `.env.local` SHALL NOT be modified without explicit request.

#### Scenario: Agent receives ambiguous backend request

- **WHEN** a user says "fix the auth endpoint" without specifying which backend
- **THEN** the agent SHALL modify only `backend-node/` and SHALL NOT touch `backend/` nor `backend-worker/`

#### Scenario: Agent receives explicit Cloudflare request

- **WHEN** a user says "deploy to Cloudflare Workers" or "update backend-worker"
- **THEN** the agent MAY modify `backend-worker/` and run `wrangler deploy`

#### Scenario: Agent sees env files

- **WHEN** an agent needs environment variables
- **THEN** the agent SHALL NOT modify `.env`, `.env.production`, or `.env.local` without explicit user request

### Requirement: openspec/config.yaml must reflect the real stack

`openspec/config.yaml` SHALL describe the current technology stack accurately in its `context` block:

- Backend: Hono 4.7 + TypeScript 5.8 (NOT FastAPI)
- Frontend: React 19 + Vite + TypeScript (NOT React 18)
- CSS: Tailwind CSS v4 with Vite plugin (NOT Tailwind v3 + shadcn/ui)
- Monorepo structure: `backend-node/` (Hono), `backend/` (FastAPI deprecated), `backend-worker/` (Cloudflare Workers), `frontend/` (React + Vite)

#### Scenario: Agent reads config.yaml context

- **WHEN** an agent reads `openspec/config.yaml` for project context
- **THEN** the context SHALL describe Hono as the backend (not FastAPI), Tailwind v4 (not v3), and React 19 (not 18)

#### Scenario: Rules section is preserved

- **WHEN** `config.yaml` is updated
- **THEN** the `rules` block for proposal, design, tasks, and specs SHALL remain unchanged

### Requirement: agent startup instructions

The agent instructions file `IDEA.md` SHALL begin with a directive identifying itself as the authoritative rules document for PetConnect agents. It SHALL list both `IDEA.md` and `PetConnect-Manual.md` as the first files to read when starting a session.

#### Scenario: Agent starts a new session

- **WHEN** an agent is invoked for PetConnect development
- **THEN** the agent SHALL read `IDEA.md` first for rules and stack information
