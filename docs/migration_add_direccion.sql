-- Agregar columna direccion a pet_friendly_places
ALTER TABLE pet_friendly_places ADD COLUMN IF NOT EXISTS direccion TEXT;
