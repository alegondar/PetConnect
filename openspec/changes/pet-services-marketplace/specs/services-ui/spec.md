## ADDED Requirements

### Requirement: Services page with tabs
The frontend SHALL render a `ServicesPage` at `/services` with two tabs: "Busco servicio" (service requests) and "Ofrezco servicio" (service offers).

#### Scenario: Tab navigation
- **WHEN** user visits `/services`
- **THEN** both tabs are visible with "Busco servicio" selected by default

#### Scenario: Switch to offers tab
- **WHEN** user clicks "Ofrezco servicio"
- **THEN** the offer listings replace request listings

### Requirement: Type filter chips
Each tab SHALL display horizontal filter chips: Todos, Paseador, Cuidador, Veterinario, Peluquería. Selecting a chip filters results by that type.

#### Scenario: Filter by type
- **WHEN** user clicks "Paseador" chip
- **THEN** only paseador requests/offers are displayed

### Requirement: Create request wizard modal
The frontend SHALL render `CreateRequestModal` as a 3-step wizard. Step 1 selects service type with visual icons. Step 2 collects title, description, optional pet, frequency/dates, location. Step 3 shows summary and publishes.

#### Scenario: Complete wizard
- **WHEN** user goes through all 3 steps and clicks "Publicar búsqueda"
- **THEN** a POST to `/api/v1/services/requests` is made and the modal closes with success feedback

#### Scenario: Step 2 shows conditional fields
- **WHEN** user selected "Paseador" type
- **THEN** the frequency slider "Paseos por semana" is shown

#### Scenario: Step 2 shows conditional fields for cuidador
- **WHEN** user selected "Cuidador" type
- **THEN** date pickers for "Desde" and "Hasta" are shown

### Requirement: Create offer modal
The frontend SHALL render `CreateOfferModal` with fields: service type selector, title, description, price from/to, price unit select, available days checkboxes, location, optional photo upload.

#### Scenario: Create offer
- **WHEN** user fills the form and clicks "Publicar oferta"
- **THEN** a POST to `/api/v1/services/offers` is made and the modal closes

### Requirement: Contact modal
The frontend SHALL render `ContactServiceModal` with a textarea (min 10, max 500 chars) and a submit button. It SHALL call the correct contact endpoint depending on context (request or offer).

#### Scenario: Contact a request
- **WHEN** user writes a message and clicks "Enviar"
- **THEN** `POST /api/v1/services/requests/:id/contact` is called and success message shown

### Requirement: Service detail page
The frontend SHALL render `ServiceDetailPage` for `/services/requests/:id` and `/services/offers/:id` showing full information. If the user is the owner, Edit/Delete buttons SHALL appear instead of Contact.

#### Scenario: Owner sees edit controls
- **WHEN** the authenticated user is the requester/provider of the displayed item
- **THEN** "Editar" and "Eliminar" buttons are shown

#### Scenario: Non-owner sees contact button
- **WHEN** the authenticated user is NOT the owner
- **THEN** "Contactar" button is shown

### Requirement: My services section in Settings
The Settings page SHALL include a "Mis servicios" section listing the authenticated user's requests, offers, and received contacts.

#### Scenario: List my publications
- **WHEN** user navigates to Settings
- **THEN** two lists are shown: "Mis solicitudes" and "Mis ofertas" with pause/reactivate/delete actions

#### Scenario: List received messages
- **WHEN** user views the messages subsection
- **THEN** received contact messages from `GET /api/v1/services/my-contacts` are displayed with sender info

### Requirement: Load more pagination
Both tabs on ServicesPage SHALL use "Cargar más" buttons for pagination instead of numbered pages.

#### Scenario: Load more
- **WHEN** user clicks "Cargar más"
- **THEN** the next page of results is appended to the current list
