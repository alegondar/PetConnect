## ADDED Requirements

### Requirement: DB agent definition
The project SHALL have a `db-agent.md` file in `.opencode/agents/` that defines the database schema design agent.

#### Scenario: Agent file exists
- **WHEN** checking `.opencode/agents/`
- **THEN** there SHALL be a `db-agent.md` file

### Requirement: DB agent responsibilities
The db-agent SHALL be responsible for designing the PostgreSQL schema for Supabase and writing `docs/db_schema.sql`.

#### Scenario: DB agent describes its role
- **WHEN** reading `db-agent.md`
- **THEN** it SHALL state that it designs tables, constraints, indexes, and RLS policies in `docs/db_schema.sql`

### Requirement: DB agent inputs and outputs
The db-agent SHALL declare that its input is the feature list from the orchestrator and its output is `docs/db_schema.sql`.

#### Scenario: DB agent declares I/O
- **WHEN** reading the frontmatter of `db-agent.md`
- **THEN** it SHALL specify `inputs: features list` and `outputs: docs/db_schema.sql`
