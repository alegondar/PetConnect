## 1. Base de datos

- [x] 1.1 Crear `docs/db_schema_services.sql` con ENUMs, tablas, índices, RLS, triggers y notificaciones
- [ ] 1.2 Ejecutar SQL en Supabase SQL Editor para crear las tablas

## 2. Backend: Schemas Zod

- [x] 2.1 Crear `backend-node/src/schemas/services.ts` con `ServiceType`, `ServiceStatus`, `CreateOfferRequest`, `CreateRequestRequest`, `ContactMessageRequest`

## 3. Backend: Router de servicios

- [x] 3.1 Crear `backend-node/src/routes/services.ts` con endpoints de ofertas (GET list/detail, POST, PUT, DELETE)
- [x] 3.2 Agregar endpoints de solicitudes (GET list/detail, POST, PUT, DELETE) con datos de mascota y requester
- [x] 3.3 Agregar endpoints de contacto (POST /requests/:id/contact, POST /offers/:id/contact)
- [x] 3.4 Agregar endpoint `GET /my-contacts` para mensajes recibidos del usuario autenticado
- [x] 3.5 Registrar `servicesRoutes` en `backend-node/src/index.ts`

## 4. Frontend: API client

- [x] 4.1 Agregar `servicesApi` en `frontend/src/api/endpoints/index.ts` con todos los endpoints (offers CRUD, requests CRUD, contacts)

## 5. Frontend: Modal CreateRequestModal (wizard 3 pasos)

- [x] 5.1 Crear `frontend/src/components/services/CreateRequestModal.tsx` con selector de tipo de servicio (íconos grandes)
- [x] 5.2 Implementar paso 2: formulario con título, descripción, selector de mascota, frecuencia/fechas condicionales, ubicación
- [x] 5.3 Implementar paso 3: resumen y botón Publicar con validación React Hook Form + Zod
- [x] 6.1 Crear `frontend/src/components/services/CreateOfferModal.tsx` con tipo de servicio, título, descripción, precios, días, ubicación, foto upload
- [x] 7.1 Crear `frontend/src/components/services/ContactServiceModal.tsx` con textarea y envío a endpoint de contacto
- [x] 8.1 Crear `frontend/src/pages/ServicesPage.tsx` con tabs "Busco servicio" / "Ofrezco servicio"
- [x] 8.2 Implementar chips de filtro por tipo (Todos, Paseador, Cuidador, Veterinario, Peluquería)
- [x] 8.3 Implementar cards de solicitudes con avatar, badge tipo, título, mascota, frecuencia, ubicación, botón Contactar
- [x] 8.4 Implementar cards de ofertas con foto, badge tipo, título, precio, días, ubicación, botón Contactar
- [x] 8.5 Implementar paginación "Cargar más" en ambos tabs
- [x] 9.1 Crear `frontend/src/pages/ServiceDetailPage.tsx` para `/services/requests/:id` y `/services/offers/:id`
- [x] 9.2 Mostrar botones Editar/Eliminar si es dueño, o Contactar si no
- [x] 10.1 Agregar sección "Mis servicios" en `SettingsPage.tsx` con listas de solicitudes, ofertas y mensajes recibidos
- [x] 11.1 Agregar rutas `/services`, `/services/requests/:id`, `/services/offers/:id` en `App.tsx`
- [x] 11.2 Agregar enlace "Servicios" con ícono en `Layout.tsx`
- [x] 12.1 Actualizar `docs/openapi.yaml` con todos los endpoints del módulo services
- [x] 12.2 Verificar compilación TypeScript en frontend y backend
