## ADDED Requirements

### Requirement: Reviewer agent definition
The project SHALL have a `reviewer.md` file in `.opencode/agents/` that defines the code review agent.

#### Scenario: Agent file exists
- **WHEN** checking `.opencode/agents/`
- **THEN** there SHALL be a `reviewer.md` file

### Requirement: Reviewer agent responsibilities
The reviewer agent SHALL review all implemented code, detect errors, enforce conventions, and suggest improvements before merge.

#### Scenario: Reviewer agent describes its role
- **WHEN** reading `reviewer.md`
- **THEN** it SHALL state that it checks for SQL injection risks, missing error handling, type inconsistencies, unused imports, and adherence to project conventions

### Requirement: Reviewer agent inputs and outputs
The reviewer agent SHALL declare that its inputs are all project files and its output is a review report with findings and recommendations.

#### Scenario: Reviewer agent declares I/O
- **WHEN** reading the frontmatter of `reviewer.md`
- **THEN** it SHALL specify `inputs: [all project code]` and `outputs: review report with issues and suggestions`
