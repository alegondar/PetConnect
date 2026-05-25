## ADDED Requirements

### Requirement: OpenAPI specification placeholder
PetConnect SHALL have an `openapi.yaml` file in the `docs/` directory as a placeholder for API documentation.

#### Scenario: OpenAPI file exists
- **WHEN** checking the `docs/` directory
- **THEN** there SHALL be an `openapi.yaml` file

### Requirement: Root README
The project root SHALL have a `README.md` file describing the project, technologies, and setup instructions.

#### Scenario: README exists
- **WHEN** checking the project root
- **THEN** there SHALL be a `README.md` file

#### Scenario: README contains project info
- **WHEN** reading the `README.md`
- **THEN** it SHALL include the project name, description, technologies (FastAPI, React, Vite, pnpm), and basic setup instructions

### Requirement: Root .gitignore
The project root SHALL have a `.gitignore` file covering Python (`__pycache__/`, `*.pyc`, `venv/`), Node.js (`node_modules/`, `dist/`), and common OS/IDE files.

#### Scenario: .gitignore exists
- **WHEN** checking the project root
- **THEN** there SHALL be a `.gitignore` file

#### Scenario: Python artifacts ignored
- **WHEN** running `git status` after creating Python cache files
- **THEN** `__pycache__/` and `*.pyc` SHALL be ignored

#### Scenario: Node artifacts ignored
- **WHEN** running `git status` after installing frontend dependencies
- **THEN** `node_modules/` SHALL be ignored
