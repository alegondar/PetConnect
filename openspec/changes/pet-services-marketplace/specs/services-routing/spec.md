## ADDED Requirements

### Requirement: Services routes
The app SHALL define the following protected routes: `/services` → ServicesPage, `/services/requests/:id` → ServiceDetailPage, `/services/offers/:id` → ServiceDetailPage.

#### Scenario: Navigate to services
- **WHEN** authenticated user navigates to `/services`
- **THEN** ServicesPage renders with both tabs

#### Scenario: Navigate to request detail
- **WHEN** user navigates to `/services/requests/:id`
- **THEN** ServiceDetailPage renders with the request's full information

#### Scenario: Navigate to offer detail
- **WHEN** user navigates to `/services/offers/:id`
- **THEN** ServiceDetailPage renders with the offer's full information

#### Scenario: Unauthenticated redirect
- **WHEN** unauthenticated user visits any `/services/*` route
- **THEN** they are redirected to `/login`
