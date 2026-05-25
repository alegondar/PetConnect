## Context

PetConnect tiene 7 features v1 definidos que requieren un schema PostgreSQL sólido como base. El schema se despliega en Supabase y debe aprovechar sus características: Row Level Security, `auth.users` integrado, y UUID nativo.

## Goals / Non-Goals

**Goals:**
- Cubrir todas las entidades necesarias para los 7 features v1
- Usar UUID como PK en todas las tablas
- Timestamps `created_at`/`updated_at` en todas las tablas
- Políticas RLS por usuario autenticado
- Índices en columnas de búsqueda frecuente
- Triggers automáticos para `updated_at`

**Non-Goals:**
- Datos de prueba (seeds)
- Funciones de negocio complejas (se harán en backend)
- Buckets de Storage (se configuran en Supabase Dashboard)

## Decisions

- **`auth.users` nativo de Supabase + tabla `profiles` propia**: Supabase maneja auth, nosotros extendemos con datos de perfil. Alternativa: tabla users propia con auth manual — descartado por complejidad de seguridad.
- **`likes` como tabla independiente (no contador en `posts`)**: Permite saber quién dio like, evita race conditions, y permite queries como "posts que le gustan a X". El contador `likes_count` en `posts` se mantiene vía trigger para performance de lectura.
- **`weekly_ranking` como vista materializada**: Se refresca cada hora vía pg_cron. Alternativa: query en tiempo real — descartado por costo en queries frecuentes.
- **`lost_pets` con `last_seen_lat/lng` como DECIMAL(10,7)**: Suficiente precisión (~1cm). Alternativa: PostGIS — descartado por innecesario para el caso de uso actual.

## Risks / Trade-offs

- **[Riesgo] El trigger de likes_count puede desincronizarse** → Mitigación: recalcular periódicamente con función `refresh_likes_count()`
- **[Riesgo] La vista materializada de ranking puede estar desactualizada** → Mitigación: refresh via pg_cron cada hora; documentar en API que los datos pueden tener hasta 1h de delay
