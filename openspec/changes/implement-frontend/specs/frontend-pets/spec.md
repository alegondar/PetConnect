## ADDED Requirements

### Requirement: My pets page
The frontend SHALL render a MyPetsPage listing the user's pets with add/edit/delete.

#### Scenario: List user's pets
- **WHEN** user visits `/my-pets`
- **THEN** their pets SHALL be displayed as cards with photo, name, species

#### Scenario: Add pet
- **WHEN** user fills the create pet form and submits
- **THEN** the new pet SHALL appear in the list

### Requirement: Vet visits management
The frontend SHALL allow viewing and adding vet visits per pet.

#### Scenario: List vet visits
- **WHEN** user selects a pet and views vet visits
- **THEN** visits SHALL be listed with date, vet name, reason

#### Scenario: Add vet visit
- **WHEN** user fills vet visit form (vet_name, date, reason)
- **THEN** the visit SHALL be added to the pet's history

### Requirement: Pet events (health)
The frontend SHALL allow viewing and adding health events per pet.

#### Scenario: List events
- **WHEN** user views a pet's events
- **THEN** events SHALL show event_type, date, value
