## ADDED Requirements

### Requirement: Visitante puede navegar contenido público sin autenticación
El sistema SHALL permitir que un usuario sin token de sesión acceda a las páginas de feed, mascotas perdidas, adopciones y lugares pet-friendly sin ser redirigido a /login.

#### Scenario: Acceso a /feed sin sesión
- **WHEN** un visitante sin token navega a `/feed`
- **THEN** el sistema renderiza la página de feed con los posts públicos cargados desde el backend
- **AND** no redirige a `/login`

#### Scenario: Acceso a /lost-pets sin sesión
- **WHEN** un visitante sin token navega a `/lost-pets`
- **THEN** el sistema renderiza la lista de mascotas perdidas
- **AND** no redirige a `/login`

#### Scenario: Acceso a /lost-pets/:id sin sesión
- **WHEN** un visitante sin token navega a `/lost-pets/abc-123`
- **THEN** el sistema renderiza el detalle de la mascota perdida
- **AND** no redirige a `/login`

#### Scenario: Acceso a /adoptions sin sesión
- **WHEN** un visitante sin token navega a `/adoptions`
- **THEN** el sistema renderiza la lista de mascotas en adopción
- **AND** no redirige a `/login`

#### Scenario: Acceso a /pet-friendly sin sesión
- **WHEN** un visitante sin token navega a `/pet-friendly`
- **THEN** el sistema renderiza la lista de lugares pet-friendly
- **AND** no redirige a `/login`

#### Scenario: Sesión expirada en ruta protegida
- **WHEN** un usuario con token inválido o expirado intenta acceder a cualquier ruta
- **THEN** el interceptor 401 detecta que había token almacenado
- **AND** limpia localStorage y redirige a `/login`

#### Scenario: Request anónimo recibe 401
- **WHEN** un visitante sin token realiza una request que retorna 401
- **THEN** el interceptor NO limpia localStorage ni redirige
- **AND** la promesa se rechaza normalmente para que el componente la maneje

### Requirement: Rutas protegidas siguen requiriendo autenticación
El sistema SHALL mantener la protección de autenticación en todas las rutas no listadas como públicas.

#### Scenario: Acceso a /my-pets sin sesión
- **WHEN** un visitante sin token navega a `/my-pets`
- **THEN** el sistema redirige a `/login`

#### Scenario: Acceso a /settings sin sesión
- **WHEN** un visitante sin token navega a `/settings`
- **THEN** el sistema redirige a `/login`

#### Scenario: Acceso a /instapet/:petId sin sesión
- **WHEN** un visitante sin token navega a `/instapet/abc-123`
- **THEN** el sistema redirige a `/login`

#### Scenario: Acceso a /profile/:userId sin sesión
- **WHEN** un visitante sin token navega a `/profile/abc-123`
- **THEN** el sistema redirige a `/login`

#### Scenario: Acceso a /services sin sesión
- **WHEN** un visitante sin token navega a `/services`
- **THEN** el sistema redirige a `/login`

#### Scenario: Usuario autenticado accede a ruta protegida
- **WHEN** un usuario con token válido navega a cualquier ruta protegida
- **THEN** el sistema renderiza la página normalmente
- **AND** el comportamiento es idéntico al actual
