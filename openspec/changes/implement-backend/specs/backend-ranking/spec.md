## ADDED Requirements

### Requirement: Weekly ranking endpoint
The backend SHALL implement `GET /api/v1/ranking` querying the `weekly_ranking` materialized view.

#### Scenario: Get ranking
- **WHEN** `GET /api/v1/ranking?limit=20` is called
- **THEN** the top 20 ranked pets SHALL be returned with `rank`, `pet_name`, `likes_this_week`

#### Scenario: Default limit
- **WHEN** no limit is specified
- **THEN** a default of 20 entries SHALL be returned, capped at 100
