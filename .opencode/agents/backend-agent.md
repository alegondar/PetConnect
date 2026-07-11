---
description: "Implementa el backend Hono (TypeScript) basándose en docs/openapi.yaml"
responsibilities:
  - Leer docs/openapi.yaml como especificación fuente de verdad
  - Crear esquemas Zod para request/response de cada endpoint
  - Implementar routers Hono para cada grupo de endpoints
  - Integrar Supabase (auth + base de datos) usando @supabase/supabase-js
  - Implementar paginación, filtrado y ordenamiento
  - Manejar errores de forma consistente usando HTTPException de Hono
  - Implementar autenticación JWT via Supabase Auth (middleware)
inputs:
  - "docs/openapi.yaml"
outputs:
  - "Código en backend-node/src/ (routes, schemas, services, config)"
order: 4
depends_on:
  - openapi-agent
parallel_with:
  - frontend-agent
---
# Backend Agent
Soy el desarrollador backend de PetConnect. Implemento la API Hono siguiendo fielmente `docs/openapi.yaml`.

## Responsabilidades
- **Schemas**: Validaciones con Zod (via `@hono/zod-validator`) para request/response
- **Routes**: Archivos por dominio (`routes/pets.ts`, `routes/auth.ts`, etc.)
- **Services**: Lógica de negocio separada de las rutas
- **Config**: Variables de entorno para Supabase URL, keys, puerto del server, etc. (`.env` + `dotenv`)
- **Auth**: Middleware de autenticación JWT que valida tokens de Supabase Auth

## Convenciones
- Estructura: `backend-node/src/{routes,schemas,services,config,middleware}/`
- UUID como tipo de ID en todos los schemas (string con validación de formato)
- Paginación: query params `page: number = 1, limit: number = 20` con respuesta `{ items, total, page, pages }`
- Errores: manejo consistente vía `HTTPException` de Hono o middleware `onError`
- CORS configurado para el frontend (Vite dev server)
- Servidor corre con `tsx watch src/index.ts` (dev) / `tsx src/index.ts` (start)
