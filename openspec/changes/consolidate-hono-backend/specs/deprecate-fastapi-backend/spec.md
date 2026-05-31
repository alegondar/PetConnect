## ADDED Requirements

### Requirement: Deprecated backend directory is clearly marked
El directorio `backend/` SHALL contener un archivo `DEPRECATED.md` que indique su estado obsoleto, la fecha de deprecación, el motivo, y una referencia al backend activo (`backend-node/`).

#### Scenario: DEPRECATED.md exists in backend/
- **WHEN** se lista el contenido de `backend/`
- **THEN** existe un archivo `DEPRECATED.md`

#### Scenario: DEPRECATED.md contains required information
- **WHEN** se lee `backend/DEPRECATED.md`
- **THEN** el archivo incluye: fecha de deprecación, motivo ("backend migrado a Hono en backend-node/"), referencia explícita a `backend-node/` como reemplazo, e instrucción de no usar este directorio para nuevo desarrollo

#### Scenario: FastAPI code is preserved
- **WHEN** se inspecciona `backend/app/main.py`
- **THEN** el archivo existe y no fue modificado (el código legacy se preserva sin cambios)
