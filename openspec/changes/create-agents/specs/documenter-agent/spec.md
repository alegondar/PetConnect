## ADDED Requirements

### Requirement: Documenter agent definition
The project SHALL have a `documenter.md` file in `.opencode/agents/` that defines the technical documentation agent.

#### Scenario: Agent file exists
- **WHEN** checking `.opencode/agents/`
- **THEN** there SHALL be a `documenter.md` file

### Requirement: Documenter agent responsibilities
The documenter agent SHALL generate technical documentation for the project, update the README, and maintain a CHECKLIST.md of completed tasks.

#### Scenario: Documenter agent describes its role
- **WHEN** reading `documenter.md`
- **THEN** it SHALL state that it creates and updates `README.md`, `docs/ARCHITECTURE.md`, `docs/API_REFERENCE.md`, and `CHECKLIST.md`

### Requirement: Documenter agent inputs and outputs
The documenter agent SHALL declare that its inputs are the OpenAPI spec and the final codebase, and its outputs are documentation files.

#### Scenario: Documenter agent declares I/O
- **WHEN** reading the frontmatter of `documenter.md`
- **THEN** it SHALL specify `inputs: [docs/openapi.yaml, final codebase]` and `outputs: [docs/*.md, CHECKLIST.md, README.md]`
