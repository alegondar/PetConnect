## ADDED Requirements

### Requirement: Weekly ranking endpoint
The OpenAPI spec SHALL define a ranking endpoint based on the `weekly_ranking` materialized view.

#### Scenario: Get weekly ranking
- **WHEN** reading the spec
- **THEN** there SHALL be `GET /api/v1/ranking?limit=20` returning an array of `{rank, pet_id, pet_name, pet_photo_url, owner_username, likes_this_week}`

#### Scenario: Ranking schema
- **WHEN** reading the spec
- **THEN** `components/schemas/RankingEntry` SHALL include `rank, pet_id, pet_name, pet_photo_url, owner_username, likes_this_week, updated_at`
