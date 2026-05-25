## Context

`docs/openapi.yaml` define 47 operaciones en ~25 paths. El backend debe implementar cada una siguiendo el contrato sin desviaciones. La estructura actual de `backend/` solo tiene `app/main.py` con un health check.

## Goals / Non-Goals

**Goals:**
- Implementar todos los endpoints del openapi.yaml con FastAPI
- Integrar Supabase para auth (JWT) y base de datos (supabase-py)
- Separar responsabilidades: routers → services → supabase
- Pydantic v2 para validación de request/response
- Paginación consistente con wrapper `{items, total, page, pages}`

**Non-Goals:**
- Rate limiting (se configura en infraestructura)
- File upload a Supabase Storage (futuro)
- WebSockets
- Tests (los hará tester-agent)

## Decisions

- **supabase-py como cliente único**: Maneja auth y database en una sola librería. Alternativa: httpx directo a REST API + python-jose — descartado por duplicación de lógica.
- **Dependencia de auth por middleware**: `get_current_user` como FastAPI dependency que valida el JWT contra Supabase. Alternativa: decorador personalizado — descartado porque FastAPI favorece dependency injection.
- **Servicios separados por dominio**: Cada router llama a un service que encapsula queries a Supabase. Permite testear servicios sin HTTP.
- **Modelos Pydantic en `schemas/` y `models/`**: `schemas/` para request/response (API contract), `models/` para objetos de dominio internos si difieren.

## Risks / Trade-offs

- **[Riesgo] supabase-py puede tener breaking changes** → Mitigación: fijar versión exacta en requirements.txt
- **[Riesgo] Las queries directas a Supabase pueden ser lentas sin índices** → Mitigación: el schema ya tiene índices definidos; monitorear con EXPLAIN ANALYZE
