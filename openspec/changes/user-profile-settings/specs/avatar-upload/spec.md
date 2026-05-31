## ADDED Requirements

### Requirement: Avatar upload component
The system SHALL provide a reusable `AvatarUpload` component that uploads an image to Supabase Storage and returns the public URL.

#### Scenario: User selects an image
- **WHEN** user clicks the avatar area and selects a JPG or PNG file
- **THEN** the component shows a preview of the selected image and uploads it to `avatars/{userId}/avatar.{timestamp}.{ext}`

#### Scenario: Upload in progress
- **WHEN** the upload is in progress
- **THEN** the component shows a loading spinner or progress indicator

#### Scenario: Upload succeeds
- **WHEN** the upload completes successfully
- **THEN** the component calls `onUploaded(url)` with the public URL of the uploaded image

#### Scenario: Upload fails
- **WHEN** the upload fails (network error, bucket not found, etc.)
- **THEN** the component displays an error message below the avatar

### Requirement: Avatar component renders current avatar
The AvatarUpload SHALL display the current avatar URL if provided, or a placeholder with a camera icon if no avatar exists.

#### Scenario: User has an existing avatar
- **WHEN** `currentUrl` prop is provided
- **THEN** the component renders the image from that URL

#### Scenario: User has no avatar
- **WHEN** `currentUrl` prop is null or undefined
- **THEN** the component renders a circular placeholder with a camera icon
