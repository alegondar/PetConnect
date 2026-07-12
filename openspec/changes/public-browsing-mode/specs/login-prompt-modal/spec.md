## ADDED Requirements

### Requirement: Modal de login se muestra al intentar acción protegida sin sesión
El sistema SHALL mostrar un modal contextual de login cuando un visitante sin token intenta realizar una acción que requiere autenticación (like, comentar, publicar, seguir, contactar servicio), en lugar de redirigir a /login o recargar la página.

#### Scenario: Like sin sesión muestra el modal
- **WHEN** un visitante sin token hace clic en el botón de like de un post
- **THEN** el sistema abre `LoginPromptModal` con el mensaje "Creá tu cuenta gratis para dar like"
- **AND** no se ejecuta la mutación de like
- **AND** no se redirige a /login

#### Scenario: Comentar sin sesión muestra el modal
- **WHEN** un visitante sin token intenta publicar un comentario
- **THEN** el sistema abre `LoginPromptModal` con el mensaje "Creá tu cuenta gratis para comentar"
- **AND** no se ejecuta la mutación de comentario

#### Scenario: Seguir mascota sin sesión muestra el modal
- **WHEN** un visitante sin token hace clic en "Seguir" en InstaPet
- **THEN** el sistema abre `LoginPromptModal` con el mensaje "Creá tu cuenta gratis para seguir a esta mascota"
- **AND** no se ejecuta la mutación de follow

#### Scenario: Contactar servicio sin sesión muestra el modal
- **WHEN** un visitante sin token intenta contactar un servicio
- **THEN** el sistema abre `LoginPromptModal` con el mensaje "Creá tu cuenta gratis para contactar"
- **AND** no se ejecuta la mutación de contacto

#### Scenario: Usuario autenticado no ve el modal
- **WHEN** un usuario con token válido hace clic en like, comentar, seguir o contactar
- **THEN** el sistema ejecuta la mutación normalmente
- **AND** `LoginPromptModal` no se abre

### Requirement: El modal ofrece navegación a login y registro
El sistema SHALL proveer botones en `LoginPromptModal` para navegar a `/login` y `/register`, y una opción para cerrar el modal sin navegar.

#### Scenario: Usuario elige ir a login desde el modal
- **WHEN** el visitante hace clic en "Iniciar sesión" dentro de `LoginPromptModal`
- **THEN** el sistema navega a `/login`
- **AND** el modal se cierra

#### Scenario: Usuario elige ir a registro desde el modal
- **WHEN** el visitante hace clic en "Crear cuenta" dentro de `LoginPromptModal`
- **THEN** el sistema navega a `/register`
- **AND** el modal se cierra

#### Scenario: Usuario cierra el modal sin navegar
- **WHEN** el visitante hace clic en la X de cierre o fuera del modal
- **THEN** el modal se cierra
- **AND** el usuario permanece en la misma página

### Requirement: El modal es visualmente consistente con la UI existente
El sistema SHALL implementar `LoginPromptModal` usando Tailwind CSS v4 y los mismos patrones de diseño que los modales existentes (`FollowersModal`, `FollowingModal`, `CreatePostModal`).

#### Scenario: Estilo visual del modal
- **WHEN** `LoginPromptModal` se renderiza
- **THEN** usa la paleta de colores del proyecto (primary #D946EF, background #F9FAFB)
- **AND** tiene backdrop con blur
- **AND** usa los mismos patrones de animación y layout que los modales existentes
