## Context

`docs/db_schema.sql` ya define 9 tablas con sus relaciones. El openapi-agent debe generar `docs/openapi.yaml` con endpoints RESTful para cada entidad, sirviendo como contrato único entre backend y frontend.

## Goals / Non-Goals

**Goals:**
- Endpoints CRUD para cada entidad del schema
- Paginación estandarizada en todos los GET de lista
- Schemas de request/response tipados con ejemplos
- Autenticación Bearer JWT documentada globalmente
- Códigos de error HTTP documentados (400, 401, 403, 404, 422, 500)

**Non-Goals:**
- Implementar la lógica de los endpoints (eso lo hará backend-agent)
- Definir rate limiting (se configura en infraestructura)
- Documentar WebSockets (no están en v1)

## Decisions

- **Prefijo `/api/v1` en todas las rutas**: Permite versionado futuro. Alternativa: sin prefijo — descartado por falta de versionado.
- **Respuesta de lista paginada con wrapper `{items, total, page, pages}`**: Estándar consistente en todos los endpoints. Alternativa: headers Link — descartado por menor ergonomía en frontend.
- **Endpoints anidados para relaciones**: `/pets/{pet_id}/vet-visits` en vez de `/vet-visits?pet_id=X`. Más RESTful y expresivo.
- **UUID como string en schemas**: OpenAPI no tiene tipo UUID nativo, se usa `string` con `format: uuid`.

## Risks / Trade-offs

- **[Riesgo] La especificación puede desincronizarse del schema si se modifica db_schema.sql** → Mitigación: regenerar openapi.yaml cada vez que cambie el schema (responsabilidad del openapi-agent)
- **[Riesgo] Demasiados endpoints pueden hacer la spec difícil de mantener** → Mitigación: agrupados por tag (Auth, Pets, Feed, Ranking, Community)
