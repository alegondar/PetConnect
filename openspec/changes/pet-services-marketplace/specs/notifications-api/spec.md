## ADDED Requirements

### Requirement: Service contact notification type
The `notifications` table SHALL support the type `service_contact` in addition to existing types `new_follower`, `new_like`, `new_comment`.

#### Scenario: Receive service contact notification
- **WHEN** another user sends a contact message about a service
- **THEN** a notification with type `service_contact` and data containing `sender_id`, `request_id`/`offer_id`, and `message_preview` is created for the receiver

#### Scenario: Display service contact notification
- **WHEN** the notifications dropdown renders a `service_contact` notification
- **THEN** it SHALL display a relevant message like "@username te contactó sobre tu publicación"
