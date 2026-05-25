## ADDED Requirements

### Requirement: OpenAPI agent definition
The project SHALL have an `openapi-agent.md` file in `.opencode/agents/` that defines the OpenAPI specification generator agent.

#### Scenario: Agent file exists
- **WHEN** checking `.opencode/agents/`
- **THEN** there SHALL be an `openapi-agent.md` file

### Requirement: OpenAPI agent responsibilities
The openapi-agent SHALL be responsible for generating the full `docs/openapi.yaml` specification based on the database schema in `docs/db_schema.sql`.

#### Scenario: OpenAPI agent describes its role
- **WHEN** reading `openapi-agent.md`
- **THEN** it SHALL state that it reads `docs/db_schema.sql` and produces `docs/openapi.yaml` with all endpoints, request/response schemas, and path parameters

### Requirement: OpenAPI agent inputs and outputs
The openapi-agent SHALL declare that its input is `docs/db_schema.sql` and its output is `docs/openapi.yaml`.

#### Scenario: OpenAPI agent declares I/O
- **WHEN** reading the frontmatter of `openapi-agent.md`
- **THEN** it SHALL specify `inputs: docs/db_schema.sql` and `outputs: docs/openapi.yaml`
