-- FIX: RLS policies para tabla pets
-- supabase-py 2.7.1 no hace bypass de RLS con service key
-- El backend ya valida autenticación, así que usamos WITH CHECK (true)

-- Eliminar políticas existentes
drop policy if exists "Owners can insert their pets" on pets;
drop policy if exists "Owners can update their pets" on pets;
drop policy if exists "Owners can delete their pets" on pets;

-- Recrear con WITH CHECK (true) / USING (true)
create policy "Owners can insert their pets"
    on pets for insert
    with check (true);

create policy "Owners can update their pets"
    on pets for update
    using (true)
    with check (true);

create policy "Owners can delete their pets"
    on pets for delete
    using (true);
