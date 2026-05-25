## ADDED Requirements

### Requirement: Tester agent definition
The project SHALL have a `tester.md` file in `.opencode/agents/` that defines the testing agent.

#### Scenario: Agent file exists
- **WHEN** checking `.opencode/agents/`
- **THEN** there SHALL be a `tester.md` file

### Requirement: Tester agent responsibilities
The tester agent SHALL generate tests for the backend (pytest) and frontend (vitest) based on the OpenAPI specification and implemented code.

#### Scenario: Tester agent describes its role
- **WHEN** reading `tester.md`
- **THEN** it SHALL state that it writes pytest tests for backend endpoints and vitest tests for React components, covering happy paths and error cases

### Requirement: Tester agent inputs and outputs
The tester agent SHALL declare that its inputs are the implemented backend and frontend code plus `docs/openapi.yaml`, and its outputs are test files with good coverage.

#### Scenario: Tester agent declares I/O
- **WHEN** reading the frontmatter of `tester.md`
- **THEN** it SHALL specify `inputs: [backend code, frontend code, docs/openapi.yaml]` and `outputs: test files (pytest, vitest)`
