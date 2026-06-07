-- Veterinarias 24hs CABA y GBA
-- Datos institucionales importados desde KMZ

CREATE TABLE veterinarias_24hs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      text NOT NULL,
  direccion   text,
  telefono    text,
  zona        text,
  lat         float8 NOT NULL,
  lng         float8 NOT NULL,
  descripcion text,
  verified    boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_vet_zona ON veterinarias_24hs (zona);
CREATE INDEX idx_vet_coords ON veterinarias_24hs (lat, lng);

ALTER TABLE veterinarias_24hs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vets_select" ON veterinarias_24hs FOR SELECT USING (true);
CREATE POLICY "vets_insert" ON veterinarias_24hs FOR INSERT WITH CHECK (true);
