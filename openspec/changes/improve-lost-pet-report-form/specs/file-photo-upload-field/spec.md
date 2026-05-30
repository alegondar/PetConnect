## ADDED Requirements

### Requirement: Photo file upload with preview
The system SHALL replace the "URL de foto" text input with a file upload field that allows image selection from the device, shows a live preview, and uploads to Supabase Storage via `POST /api/v1/pets/upload-photo` upon form submission.

#### Scenario: User selects a photo
- **WHEN** user clicks the "Seleccionar foto" button
- **THEN** the native file explorer opens filtered to image files (`accept="image/*"`)
- **AND** upon selection, a preview thumbnail replaces the upload button

#### Scenario: User removes selected photo
- **WHEN** user has a photo preview visible
- **THEN** a dismiss button (X) MUST be available to remove the file
- **AND** clicking dismiss returns the field to the initial "Seleccionar foto" button state

#### Scenario: Photo uploads on form submit
- **WHEN** user fills required fields and clicks "Reportar" with a photo selected
- **THEN** the system MUST upload via `POST /api/v1/pets/upload-photo` (multipart/form-data, field "file")
- **AND** the returned URL MUST be sent as `photo_url` in the `POST /api/v1/community/lost-pets` payload
- **AND** the submit button MUST show "Subiendo..." while the upload is in progress

#### Scenario: Form submits without photo
- **WHEN** user submits the form without selecting a photo
- **THEN** the `photo_url` field MUST be `undefined` (omitted from payload)
- **AND** form submission proceeds normally without upload step

#### Scenario: Upload failure
- **WHEN** the photo upload fails (network or server error)
- **THEN** the system MUST display error message "Error al subir la foto"
- **AND** the lost pet report MUST NOT be created
