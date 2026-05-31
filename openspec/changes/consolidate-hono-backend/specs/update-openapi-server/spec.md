## ADDED Requirements

### Requirement: OpenAPI server description identifies Hono
La sección `servers` de `docs/openapi.yaml` SHALL identificar explícitamente a Hono como el servidor de desarrollo, sin referencias a FastAPI.

#### Scenario: Development server description mentions Hono
- **WHEN** se inspecciona la entrada `servers[0]` (servidor local) en `docs/openapi.yaml`
- **THEN** la propiedad `description` contiene "Hono" o identifica el runtime como Hono/Node.js

#### Scenario: No FastAPI references in OpenAPI
- **WHEN** se busca "FastAPI" o "Python" en `docs/openapi.yaml`
- **THEN** no se encuentran resultados

#### Scenario: Server URL remains unchanged
- **WHEN** se inspecciona la propiedad `url` del servidor local
- **THEN** el valor sigue siendo `http://localhost:8000/api/v1` (no se modifica)
