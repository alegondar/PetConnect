## ADDED Requirements

### Requirement: Lost pets page
The frontend SHALL render a LostPetsPage with list and report form, filterable by status.

#### Scenario: List lost pets
- **WHEN** user visits `/lost-pets`
- **THEN** lost pet reports SHALL be displayed with photo, name, last seen location

#### Scenario: Filter by status
- **WHEN** user selects "lost" filter
- **THEN** only active lost reports SHALL be shown

#### Scenario: Report lost pet
- **WHEN** user fills the report form with name, species, lat/lng
- **THEN** the report SHALL be created

### Requirement: Adoptions page
The frontend SHALL render an AdoptionsPage with available adoption listings.

#### Scenario: List adoptions
- **WHEN** user visits `/adoptions`
- **THEN** available pets for adoption SHALL be displayed with photo, pet info, description

#### Scenario: Publish adoption
- **WHEN** a pet owner publishes a pet for adoption
- **THEN** the listing SHALL appear in the adoptions page
