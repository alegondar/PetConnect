## ADDED Requirements

### Requirement: Designer agent definition
The project SHALL have a `designer.md` file in `.opencode/agents/` that defines the UI/UX design agent.

#### Scenario: Agent file exists
- **WHEN** checking `.opencode/agents/`
- **THEN** there SHALL be a `designer.md` file

### Requirement: Designer agent responsibilities
The designer agent SHALL define the color palette, UI component library guidelines, visual style, and mobile-first approach for PetConnect.

#### Scenario: Designer agent describes its role
- **WHEN** reading `designer.md`
- **THEN** it SHALL include color palette values, typography scales, spacing system, component style guidelines, and mobile-first breakpoints

### Requirement: Designer agent inputs and outputs
The designer agent SHALL declare that its input is the project requirements and its output is a design style guide consumed by the frontend-agent.

#### Scenario: Designer agent declares I/O
- **WHEN** reading the frontmatter of `designer.md`
- **THEN** it SHALL specify `inputs: project requirements` and `outputs: color palette, component guidelines, visual style spec`
