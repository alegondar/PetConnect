## Why

PetConnect no tiene forma de que usuarios encuentren paseadores, cuidadores, veterinarios o peluquerías para sus mascotas. Esto limita la utilidad de la app a solo lo social. Un marketplace interno ("Manada Libre") resuelve esta necesidad conectando dueños que buscan servicios con personas que los ofrecen.

## What Changes

- **Nuevas tablas**: `service_offers`, `service_requests`, `service_contacts` + ENUMs en Supabase
- **Nuevo router backend**: `services.ts` con 11 endpoints (ofertas, solicitudes, contactos) en `backend-node/`
- **Nueva página**: `ServicesPage.tsx` en `/services` con tabs "Busco servicio" / "Ofrezco servicio" y filtros por tipo
- **Nuevos modales**: `CreateRequestModal` (wizard 3 pasos), `CreateOfferModal`, `ContactServiceModal`
- **Nueva página**: `ServiceDetailPage.tsx` para `/services/requests/:id` y `/services/offers/:id`
- **Sección en Settings**: "Mis servicios" con listado de publicaciones y mensajes recibidos
- **Navegación**: enlace en Layout.tsx y rutas en App.tsx
- **Notificaciones**: trigger SQL para notificar cuando alguien contacta

## Capabilities

### New Capabilities

- `services-db`: Tablas `service_offers`, `service_requests`, `service_contacts` con ENUMs, índices, RLS y triggers
- `services-api`: Endpoints REST para CRUD de ofertas, solicitudes y contacto entre usuarios
- `services-ui`: Página principal, página de detalle, modales de creación y contacto, sección en Settings
- `services-routing`: Nuevas rutas `/services`, `/services/requests/:id`, `/services/offers/:id`

### Modified Capabilities

- `layout-ui`: Agregar enlace "Servicios" al menú de navegación inferior
- `notifications-api`: Nuevo tipo de notificación `service_contact` desde trigger SQL

## Impact

- **Backend**: `backend-node/src/routes/services.ts`, `backend-node/src/schemas/services.ts`, `backend-node/src/index.ts`
- **Frontend**: `ServicesPage.tsx`, `ServiceDetailPage.tsx`, `CreateRequestModal.tsx`, `CreateOfferModal.tsx`, `ContactServiceModal.tsx`, `SettingsPage.tsx`, `Layout.tsx`, `App.tsx`
- **DB**: `docs/db_schema_services.sql` (nuevo), `docs/openapi.yaml`
- **Dependencias**: Sin nuevas dependencias externas
