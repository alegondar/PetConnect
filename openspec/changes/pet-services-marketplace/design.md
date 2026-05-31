## Context

El proyecto ya tiene backend Hono en `backend-node/` con middleware de auth (`authMiddleware` que expone `profiles.id` como `userId`), schemas Zod, y el patrón de rutas/controladores establecido. El frontend usa React 19 + Vite + Tailwind v4 con React Query, Zustand, React Router v6, React Hook Form + Zod.

## Goals / Non-Goals

**Goals:**
- Marketplace bidireccional: usuarios publican lo que buscan Y lo que ofrecen
- Tipos de servicio: paseador, cuidador, veterinario, peluquería
- Contacto directo entre usuarios vía mensajes (no chat en tiempo real)
- Notificación al recibir un mensaje de contacto
- Gestión de publicaciones propias desde Settings
- RLS con `WITH CHECK (true)` en todas las tablas nuevas (compatibilidad supabase-py)

**Non-Goals:**
- Chat en tiempo real ni WebSockets
- Sistema de pagos/reservas (solo contacto inicial)
- Backend Python (solo Node.js para este feature)
- Reviews/calificaciones de proveedores
- App Android

## Decisions

### 1. Tablas separadas para ofertas y solicitudes

**Decisión:** Dos tablas (`service_offers` y `service_requests`) en vez de una sola tabla genérica `service_posts`.

**Por qué:** Ofertas y solicitudes tienen campos distintos (precio, available_days en ofertas; pet_id, frecuencia, fechas en solicitudes). Una tabla única requeriría muchos campos nullable. La tabla `service_contacts` unifica el contacto hacia ambas.

### 2. Contacto vía tabla `service_contacts` + notificación SQL

**Decisión:** Tabla de mensajes simple + trigger SQL que inserta en `notifications`.

**Por qué:** No necesitamos chat bidireccional complejo. Un mensaje inicial con notificación es suficiente para el MVP. El trigger reutiliza la infraestructura de notificaciones existente.

### 3. Fotos de servicio usando el bucket `pets` existente

**Decisión:** Reutilizar el endpoint `POST /api/v1/pets/upload-photo` y el bucket Supabase `pets` para fotos de servicios.

**Alternativa rechazada:** Bucket separado `services`. Se rechazó para no complicar el setup. Las fotos de mascotas y servicios comparten bucket.

### 4. Filters en el frontend, no en el backend

**Decisión:** El backend devuelve todos los resultados paginados; el filtrado por tipo y ubicación se hace vía query params (`?type=`, `?location=`). Los tabs "Busco/Ofrezco" son dos llamadas API distintas, no un filtro cliente.

### 5. CreateRequestModal como wizard de 3 pasos

**Decisión:** Wizard secuencial en vez de formulario largo.

**Por qué:** Reduce la fricción de crear una solicitud. Cada paso tiene un foco claro. React Hook Form maneja el estado entre pasos.

## Risks / Trade-offs

- **[Riesgo]** Tablas nuevas sin datos previos: cero migración de datos. → No aplica, son tablas nuevas.
- **[Riesgo]** `service_contacts` crece sin límite. → A futuro considerar soft-delete o archivado. Para MVP es aceptable.
- **[Riesgo]** El bucket `pets` se usa para fotos de servicios (sin separación lógica). → Las rutas de archivo incluyen `userId` así que la separación por usuario existe naturalmente.

## Migration Plan

1. Ejecutar `docs/db_schema_services.sql` en Supabase SQL Editor
2. Deploy backend Node.js (nuevo router `services.ts`)
3. Deploy frontend (nueva página, modales, rutas)
4. No requiere migración de datos (tablas vacías inicialmente)
