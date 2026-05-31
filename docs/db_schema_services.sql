-- ============================================================================
-- PetConnect — Manada Libre: Servicios para mascotas
-- Paseadores, Cuidadores, Veterinarios, Peluquerías
-- ============================================================================

-- ENUM tipos de servicio
CREATE TYPE service_type AS ENUM (
  'paseador',
  'cuidador',
  'veterinario',
  'peluqueria'
);

-- ENUM estado de publicación
CREATE TYPE service_status AS ENUM (
  'activo',
  'pausado',
  'cerrado'
);

-- ============================================================================
-- Tabla de ofertas de servicio (quién ofrece)
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_offers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_type    service_type NOT NULL,
  title           text NOT NULL,
  description     text NOT NULL,
  price_from      numeric(10,2),
  price_to        numeric(10,2),
  price_unit      text DEFAULT 'por visita',
  location        text NOT NULL,
  lat             float8,
  lng             float8,
  available_days  text[] DEFAULT '{}',
  photo_url       text,
  status          service_status NOT NULL DEFAULT 'activo',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_service_offers_provider ON service_offers(provider_id);
CREATE INDEX idx_service_offers_type ON service_offers(service_type);
CREATE INDEX idx_service_offers_status ON service_offers(status);

-- ============================================================================
-- Tabla de solicitudes de servicio (quién busca)
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_requests (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_type      service_type NOT NULL,
  title             text NOT NULL,
  description       text NOT NULL,
  pet_id            uuid REFERENCES pets(id) ON DELETE SET NULL,
  frequency_per_week int,
  start_date        date,
  end_date          date,
  location          text NOT NULL,
  lat               float8,
  lng               float8,
  status            service_status NOT NULL DEFAULT 'activo',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_service_requests_requester ON service_requests(requester_id);
CREATE INDEX idx_service_requests_type ON service_requests(service_type);
CREATE INDEX idx_service_requests_status ON service_requests(status);

-- ============================================================================
-- Tabla de contactos/respuestas
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_contacts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  uuid REFERENCES service_requests(id) ON DELETE CASCADE,
  offer_id    uuid REFERENCES service_offers(id) ON DELETE CASCADE,
  sender_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message     text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT contact_has_target CHECK (request_id IS NOT NULL OR offer_id IS NOT NULL)
);

CREATE INDEX idx_service_contacts_request ON service_contacts(request_id);
CREATE INDEX idx_service_contacts_offer ON service_contacts(offer_id);
CREATE INDEX idx_service_contacts_sender ON service_contacts(sender_id);
CREATE INDEX idx_service_contacts_receiver ON service_contacts(receiver_id);

-- ============================================================================
-- RLS — WITH CHECK (true) para compatibilidad con supabase-py
-- ============================================================================
ALTER TABLE service_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_offers_select" ON service_offers FOR SELECT USING (true);
CREATE POLICY "service_offers_insert" ON service_offers FOR INSERT WITH CHECK (true);
CREATE POLICY "service_offers_update" ON service_offers FOR UPDATE WITH CHECK (true);
CREATE POLICY "service_offers_delete" ON service_offers FOR DELETE USING (true);

ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_requests_select" ON service_requests FOR SELECT USING (true);
CREATE POLICY "service_requests_insert" ON service_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "service_requests_update" ON service_requests FOR UPDATE WITH CHECK (true);
CREATE POLICY "service_requests_delete" ON service_requests FOR DELETE USING (true);

ALTER TABLE service_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_contacts_select" ON service_contacts FOR SELECT USING (true);
CREATE POLICY "service_contacts_insert" ON service_contacts FOR INSERT WITH CHECK (true);

-- ============================================================================
-- Triggers updated_at
-- ============================================================================
CREATE TRIGGER update_service_offers_updated_at
  BEFORE UPDATE ON service_offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at
  BEFORE UPDATE ON service_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Notificación cuando alguien contacta
-- ============================================================================
CREATE OR REPLACE FUNCTION notify_service_contact()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, data)
  VALUES (
    NEW.receiver_id,
    'service_contact',
    jsonb_build_object(
      'sender_id', NEW.sender_id,
      'request_id', NEW.request_id,
      'offer_id', NEW.offer_id,
      'message_preview', LEFT(NEW.message, 80)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_service_contact
AFTER INSERT ON service_contacts
FOR EACH ROW EXECUTE FUNCTION notify_service_contact();
