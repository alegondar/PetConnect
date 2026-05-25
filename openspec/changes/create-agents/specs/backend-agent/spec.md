## ADDED Requirements

### Requirement: Backend agent definition
The project SHALL have a `backend-agent.md` file in `.opencode/agents/` that defines the FastAPI implementation agent.

#### Scenario: Agent file exists
- **WHEN** checking `.opencode/agents/`
- **THEN** there SHALL be a `backend-agent.md` file

### Requirement: Backend agent responsibilities
The backend-agent SHALL implement FastAPI endpoints, models, and services based entirely on `docs/openapi.yaml`.

#### Scenario: Backend agent describes its role
- **WHEN** reading `backend-agent.md`
- **THEN** it SHALL state that it creates FastAPI routers, Pydantic models, and service files following the OpenAPI contract

### Requirement: Backend agent inputs and outputs
The backend-agent SHALL declare that its input is `docs/openapi.yaml` and its output is the `backend/` codebase.

#### Scenario: Backend agent declares I/O
- **WHEN** reading the frontmatter of `backend-agent.md`
- **THEN** it SHALL specify `inputs: docs/openapi.yaml` and `outputs: backend/ routes, models, services`
