## ADDED Requirements

### Requirement: Orchestrator agent definition
The project SHALL have an `orchestrator.md` agent file in `.opencode/agents/` that defines the master coordination agent.

#### Scenario: Agent file exists
- **WHEN** checking `.opencode/agents/`
- **THEN** there SHALL be an `orchestrator.md` file

### Requirement: Orchestrator responsibilities
The orchestrator agent SHALL define its responsibility as coordinating and delegating tasks to other agents in a predefined execution order.

#### Scenario: Orchestrator describes delegation flow
- **WHEN** reading `orchestrator.md`
- **THEN** it SHALL list the execution order: designer → db → openapi → (backend | frontend) → tester → reviewer → documenter

### Requirement: Orchestrator inputs and outputs
The orchestrator agent SHALL declare that its input is a feature description from the user and its output is a completed feature with all artifacts verified.

#### Scenario: Orchestrator declares I/O
- **WHEN** reading the frontmatter of `orchestrator.md`
- **THEN** it SHALL specify `inputs: feature description` and `outputs: implemented and tested feature`
