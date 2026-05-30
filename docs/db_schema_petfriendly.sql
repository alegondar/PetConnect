-- ============================================================================
-- PET FRIENDLY PLACES
-- Directorio de lugares pet-friendly en Buenos Aires
-- Fuente: Mapa Dog Friendly Buenos Aires - Pet Friendly BA (Google My Maps)
-- ============================================================================

-- Tipo ENUM para categorias
do $$ begin
    create type pet_friendly_category as enum (
        'cafeteria',
        'bar_restaurante',
        'hotel',
        'experiencia'
    );
exception
    when duplicate_object then null;
end $$;

-- Tabla principal
create table pet_friendly_places (
    id            uuid primary key default gen_random_uuid(),
    nombre        text not null,
    categoria     pet_friendly_category not null,
    lat           float8 not null,
    lng           float8 not null,
    descripcion   text,
    foto_url      text,
    fuente        text not null default 'usuario',
    verificado    boolean not null default false,
    created_by    uuid references profiles(id) on delete set null,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);

-- indices
create index idx_pf_categoria on pet_friendly_places (categoria);
create index idx_pf_coords on pet_friendly_places (lat, lng);

-- RLS: lectura publica, insercion solo autenticados (backend valida auth)
-- NOTA: supabase-py 2.7.1 no hace bypass de RLS con SERVICE_KEY.
-- Las politicas usan WITH CHECK (true) porque get_current_user() ya valida.
alter table pet_friendly_places enable row level security;

create policy "Pet friendly places are viewable by everyone"
    on pet_friendly_places for select
    using (true);

create policy "Authenticated users can insert places"
    on pet_friendly_places for insert
    with check (true);
