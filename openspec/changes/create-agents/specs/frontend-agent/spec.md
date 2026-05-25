## ADDED Requirements

### Requirement: Frontend agent definition
The project SHALL have a `frontend-agent.md` file in `.opencode/agents/` that defines the React + Vite + Tailwind implementation agent.

#### Scenario: Agent file exists
- **WHEN** checking `.opencode/agents/`
- **THEN** there SHALL be a `frontend-agent.md` file

### Requirement: Frontend agent responsibilities
The frontend-agent SHALL implement React pages, components, and API integration based on `docs/openapi.yaml` and the designer's style guide from `designer.md`.

#### Scenario: Frontend agent describes its role
- **WHEN** reading `frontend-agent.md`
- **THEN** it SHALL state that it creates React components with Tailwind CSS following the designer's visual guide and consuming the OpenAPI-defined endpoints

### Requirement: Frontend agent inputs and outputs
The frontend-agent SHALL declare that its inputs are `docs/openapi.yaml` and the designer's style guide, and its output is the `frontend/` codebase.

#### Scenario: Frontend agent declares I/O
- **WHEN** reading the frontmatter of `frontend-agent.md`
- **THEN** it SHALL specify `inputs: [docs/openapi.yaml, designer style guide]` and `outputs: frontend/ pages, components, API layer`
