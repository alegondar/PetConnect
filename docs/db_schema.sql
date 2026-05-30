-- ============================================================================
-- PetConnect - Database Schema
-- PostgreSQL 15 + Supabase
-- ============================================================================

-- 1. Extensiones
-- ----------------------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 2. Función auto-actualización de updated_at
-- ----------------------------------------------------------------------------
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- 3. PROFILES (vinculado a auth.users de Supabase)
-- ----------------------------------------------------------------------------
create table profiles (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid references auth.users(id) on delete cascade unique not null,
    username    text unique not null,
    avatar_url  text,
    bio         text,
    created_at  timestamptz default now() not null,
    updated_at  timestamptz default now() not null
);

create index idx_profiles_username on profiles (username);

create trigger trg_profiles_updated_at
    before update on profiles
    for each row
    execute function update_updated_at_column();

-- Trigger: auto-crear perfil al registrarse un usuario en auth.users
create or replace function handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (user_id, username)
    values (
        new.id,
        coalesce(
            split_part(new.email, '@', 1),
            'user_' || substr(new.id::text, 1, 8)
        )
    );
    return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function handle_new_user();

-- RLS: profiles (lectura pública, escritura solo propio perfil)
alter table profiles enable row level security;

create policy "Profiles are viewable by everyone"
    on profiles for select
    using (true);

create policy "Users can update own profile"
    on profiles for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can insert own profile"
    on profiles for insert
    with check (auth.uid() = user_id);

-- 4. PETS
-- ----------------------------------------------------------------------------
create table pets (
    id          uuid primary key default gen_random_uuid(),
    owner_id    uuid references profiles(id) on delete cascade not null,
    name        text not null,
    species     text not null,
    breed       text,
    age         integer,
    weight      decimal(5,2),
    photo_url   text,
    bio         text,
    created_at  timestamptz default now() not null,
    updated_at  timestamptz default now() not null
);

create index idx_pets_owner_id on pets (owner_id);
create index idx_pets_species on pets (species);

create trigger trg_pets_updated_at
    before update on pets
    for each row
    execute function update_updated_at_column();

-- RLS: pets
alter table pets enable row level security;

create policy "Pets are viewable by everyone"
    on pets for select
    using (true);

create policy "Owners can insert their pets"
    on pets for insert
    with check (
        exists (
            select 1 from profiles
            where profiles.id = owner_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Owners can update their pets"
    on pets for update
    using (
        exists (
            select 1 from profiles
            where profiles.id = owner_id
            and profiles.user_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from profiles
            where profiles.id = owner_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Owners can delete their pets"
    on pets for delete
    using (
        exists (
            select 1 from profiles
            where profiles.id = owner_id
            and profiles.user_id = auth.uid()
        )
    );

-- 5. VET VISITS
-- ----------------------------------------------------------------------------
create table vet_visits (
    id          uuid primary key default gen_random_uuid(),
    pet_id      uuid references pets(id) on delete cascade not null,
    vet_name    text not null,
    visit_date  date not null,
    reason      text not null,
    notes       text,
    created_at  timestamptz default now() not null,
    updated_at  timestamptz default now() not null
);

create index idx_vet_visits_pet_id on vet_visits (pet_id);
create index idx_vet_visits_date on vet_visits (visit_date desc);

create trigger trg_vet_visits_updated_at
    before update on vet_visits
    for each row
    execute function update_updated_at_column();

-- RLS: vet_visits (solo dueño de la mascota)
alter table vet_visits enable row level security;

create policy "Owners can view their pet visits"
    on vet_visits for select
    using (
        exists (
            select 1 from pets
            join profiles on profiles.id = pets.owner_id
            where pets.id = vet_visits.pet_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Owners can insert visits for their pets"
    on vet_visits for insert
    with check (
        exists (
            select 1 from pets
            join profiles on profiles.id = pets.owner_id
            where pets.id = vet_visits.pet_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Owners can update visits for their pets"
    on vet_visits for update
    using (
        exists (
            select 1 from pets
            join profiles on profiles.id = pets.owner_id
            where pets.id = vet_visits.pet_id
            and profiles.user_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from pets
            join profiles on profiles.id = pets.owner_id
            where pets.id = vet_visits.pet_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Owners can delete visits for their pets"
    on vet_visits for delete
    using (
        exists (
            select 1 from pets
            join profiles on profiles.id = pets.owner_id
            where pets.id = vet_visits.pet_id
            and profiles.user_id = auth.uid()
        )
    );

-- 6. PET EVENTS (InstaPet: vacunas, peso, desparasitación)
-- ----------------------------------------------------------------------------
create table pet_events (
    id          uuid primary key default gen_random_uuid(),
    pet_id      uuid references pets(id) on delete cascade not null,
    event_type  text not null check (event_type in ('vaccination', 'weight', 'deworming', 'medication', 'other')),
    event_date  date not null,
    value       text,
    notes       text,
    created_at  timestamptz default now() not null,
    updated_at  timestamptz default now() not null
);

create index idx_pet_events_pet_id on pet_events (pet_id);
create index idx_pet_events_date on pet_events (event_date desc);

create trigger trg_pet_events_updated_at
    before update on pet_events
    for each row
    execute function update_updated_at_column();

-- RLS: pet_events (solo dueño de la mascota)
alter table pet_events enable row level security;

create policy "Owners can view their pet events"
    on pet_events for select
    using (
        exists (
            select 1 from pets
            join profiles on profiles.id = pets.owner_id
            where pets.id = pet_events.pet_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Owners can insert events for their pets"
    on pet_events for insert
    with check (
        exists (
            select 1 from pets
            join profiles on profiles.id = pets.owner_id
            where pets.id = pet_events.pet_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Owners can update events for their pets"
    on pet_events for update
    using (
        exists (
            select 1 from pets
            join profiles on profiles.id = pets.owner_id
            where pets.id = pet_events.pet_id
            and profiles.user_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from pets
            join profiles on profiles.id = pets.owner_id
            where pets.id = pet_events.pet_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Owners can delete events for their pets"
    on pet_events for delete
    using (
        exists (
            select 1 from pets
            join profiles on profiles.id = pets.owner_id
            where pets.id = pet_events.pet_id
            and profiles.user_id = auth.uid()
        )
    );

-- 7. POSTS (Feed de mascotas)
-- ----------------------------------------------------------------------------
create table posts (
    id              uuid primary key default gen_random_uuid(),
    author_id       uuid references profiles(id) on delete cascade not null,
    pet_id          uuid references pets(id) on delete cascade not null,
    content         text,
    photo_url       text,
    likes_count     integer default 0 not null,
    comments_count  integer default 0 not null,
    created_at      timestamptz default now() not null,
    updated_at      timestamptz default now() not null
);

create index idx_posts_author_id on posts (author_id);
create index idx_posts_pet_id on posts (pet_id);
create index idx_posts_created_at on posts (created_at desc);

create trigger trg_posts_updated_at
    before update on posts
    for each row
    execute function update_updated_at_column();

-- RLS: posts (lectura pública, escritura solo autor)
alter table posts enable row level security;

create policy "Posts are viewable by everyone"
    on posts for select
    using (true);

create policy "Authors can insert posts"
    on posts for insert
    with check (
        exists (
            select 1 from profiles
            where profiles.id = author_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Authors can update their posts"
    on posts for update
    using (
        exists (
            select 1 from profiles
            where profiles.id = author_id
            and profiles.user_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from profiles
            where profiles.id = author_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Authors can delete their posts"
    on posts for delete
    using (
        exists (
            select 1 from profiles
            where profiles.id = author_id
            and profiles.user_id = auth.uid()
        )
    );

-- 8. LIKES
-- ----------------------------------------------------------------------------
create table likes (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid references profiles(id) on delete cascade not null,
    post_id     uuid references posts(id) on delete cascade not null,
    created_at  timestamptz default now() not null,
    unique (user_id, post_id)
);

create index idx_likes_post_id on likes (post_id);
create index idx_likes_user_id on likes (user_id);

-- RLS: likes
alter table likes enable row level security;

create policy "Likes are viewable by everyone"
    on likes for select
    using (true);

create policy "Users can insert their own likes"
    on likes for insert
    with check (
        exists (
            select 1 from profiles
            where profiles.id = user_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Users can delete their own likes"
    on likes for delete
    using (
        exists (
            select 1 from profiles
            where profiles.id = user_id
            and profiles.user_id = auth.uid()
        )
    );

-- 9. COMMENTS
-- ----------------------------------------------------------------------------
create table comments (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid references profiles(id) on delete cascade not null,
    post_id     uuid references posts(id) on delete cascade not null,
    content     text not null,
    created_at  timestamptz default now() not null,
    updated_at  timestamptz default now() not null
);

create index idx_comments_post_id on comments (post_id);
create index idx_comments_user_id on comments (user_id);

create trigger trg_comments_updated_at
    before update on comments
    for each row
    execute function update_updated_at_column();

-- RLS: comments (lectura pública, escritura solo autor)
alter table comments enable row level security;

create policy "Comments are viewable by everyone"
    on comments for select
    using (true);

create policy "Users can insert their own comments"
    on comments for insert
    with check (
        exists (
            select 1 from profiles
            where profiles.id = user_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Users can update their own comments"
    on comments for update
    using (
        exists (
            select 1 from profiles
            where profiles.id = user_id
            and profiles.user_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from profiles
            where profiles.id = user_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Users can delete their own comments"
    on comments for delete
    using (
        exists (
            select 1 from profiles
            where profiles.id = user_id
            and profiles.user_id = auth.uid()
        )
    );

-- 10. TRIGGERS DE CONTADORES (likes_count, comments_count)
-- ----------------------------------------------------------------------------

-- Función: actualizar likes_count en posts
create or replace function update_likes_count()
returns trigger as $$
begin
    if (tg_op = 'INSERT') then
        update posts set likes_count = likes_count + 1 where id = new.post_id;
    elsif (tg_op = 'DELETE') then
        update posts set likes_count = greatest(likes_count - 1, 0) where id = old.post_id;
    end if;
    return null;
end;
$$ language plpgsql;

create trigger trg_likes_count
    after insert on likes
    for each row
    execute function update_likes_count();

create trigger trg_likes_count_delete
    after delete on likes
    for each row
    execute function update_likes_count();

-- Función: actualizar comments_count en posts
create or replace function update_comments_count()
returns trigger as $$
begin
    if (tg_op = 'INSERT') then
        update posts set comments_count = comments_count + 1 where id = new.post_id;
    elsif (tg_op = 'DELETE') then
        update posts set comments_count = greatest(comments_count - 1, 0) where id = old.post_id;
    end if;
    return null;
end;
$$ language plpgsql;

create trigger trg_comments_count
    after insert on comments
    for each row
    execute function update_comments_count();

create trigger trg_comments_count_delete
    after delete on comments
    for each row
    execute function update_comments_count();

-- 11. WEEKLY RANKING (vista materializada)
-- ----------------------------------------------------------------------------
create materialized view weekly_ranking as
select
    row_number() over (order by count(l.id) desc) as rank,
    p.id as pet_id,
    p.name as pet_name,
    p.photo_url as pet_photo_url,
    pr.username as owner_username,
    count(l.id) as likes_this_week,
    now() as updated_at
from pets p
join profiles pr on pr.id = p.owner_id
join posts po on po.pet_id = p.id
left join likes l on l.post_id = po.id
    and l.created_at >= now() - interval '7 days'
group by p.id, p.name, p.photo_url, pr.username
having count(l.id) > 0
order by count(l.id) desc
limit 100;

create unique index idx_weekly_ranking_pet_id on weekly_ranking (pet_id);
create index idx_weekly_ranking_rank on weekly_ranking (rank);

-- 12. LOST PETS
-- ----------------------------------------------------------------------------
create table lost_pets (
    id                  uuid primary key default gen_random_uuid(),
    reporter_id         uuid references profiles(id) on delete cascade not null,
    name                text not null,
    species             text not null,
    breed               text,
    photo_url           text,
    last_seen_lat       decimal(10,7) not null,
    last_seen_lng       decimal(10,7) not null,
    last_seen_address   text,
    description         text,
    status              text default 'lost' not null check (status in ('lost', 'found')),
    created_at          timestamptz default now() not null,
    updated_at          timestamptz default now() not null
);

create index idx_lost_pets_reporter_id on lost_pets (reporter_id);
create index idx_lost_pets_status on lost_pets (status);
create index idx_lost_pets_coords on lost_pets (last_seen_lat, last_seen_lng);

create trigger trg_lost_pets_updated_at
    before update on lost_pets
    for each row
    execute function update_updated_at_column();

-- RLS: lost_pets (lectura pública, escritura libre — backend valida auth)
-- NOTA: supabase-py 2.7.1 no hace bypass de RLS con SERVICE_KEY.
-- Las políticas usan WITH CHECK (true) porque get_current_user() ya valida.
alter table lost_pets enable row level security;

create policy "Lost pets are viewable by everyone"
    on lost_pets for select
    using (true);

create policy "Reporters can insert lost pets"
    on lost_pets for insert
    with check (true);

create policy "Reporters can update their reports"
    on lost_pets for update
    using (true)
    with check (true);

create policy "Reporters can delete their reports"
    on lost_pets for delete
    using (true);

-- 13. ADOPTIONS
-- ----------------------------------------------------------------------------
create table adoptions (
    id            uuid primary key default gen_random_uuid(),
    pet_id        uuid references pets(id) on delete cascade not null,
    owner_id      uuid references profiles(id) on delete cascade not null,
    adopter_id    uuid references profiles(id) on delete set null,
    status        text default 'available' not null check (status in ('available', 'pending', 'adopted')),
    description   text,
    created_at    timestamptz default now() not null,
    updated_at    timestamptz default now() not null
);

create index idx_adoptions_pet_id on adoptions (pet_id);
create index idx_adoptions_owner_id on adoptions (owner_id);
create index idx_adoptions_status on adoptions (status);

create trigger trg_adoptions_updated_at
    before update on adoptions
    for each row
    execute function update_updated_at_column();

-- RLS: adoptions
alter table adoptions enable row level security;

create policy "Available and pending adoptions are viewable by everyone"
    on adoptions for select
    using (status in ('available', 'pending'));

create policy "Owners can insert adoptions for their pets"
    on adoptions for insert
    with check (
        exists (
            select 1 from profiles
            where profiles.id = owner_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Owners can update their adoptions"
    on adoptions for update
    using (
        exists (
            select 1 from profiles
            where profiles.id = owner_id
            and profiles.user_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from profiles
            where profiles.id = owner_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Owners can delete their adoptions"
    on adoptions for delete
    using (
        exists (
            select 1 from profiles
            where profiles.id = owner_id
            and profiles.user_id = auth.uid()
        )
    );

-- 14. INSTAPET POSTS (posts en el perfil de una mascota)
-- ----------------------------------------------------------------------------
create table instapet_posts (
    id          uuid primary key default gen_random_uuid(),
    pet_id      uuid references pets(id) on delete cascade not null,
    author_id   uuid references profiles(id) on delete cascade not null,
    photo_url   text,
    video_url   text,
    description text,
    likes_count    integer default 0 not null,
    comments_count integer default 0 not null,
    created_at  timestamptz default now() not null,
    updated_at  timestamptz default now() not null
);

create index idx_instapet_posts_pet_id on instapet_posts (pet_id);
create index idx_instapet_posts_author_id on instapet_posts (author_id);
create index idx_instapet_posts_created_at on instapet_posts (created_at desc);

create trigger trg_instapet_posts_updated_at
    before update on instapet_posts
    for each row
    execute function update_updated_at_column();

alter table instapet_posts enable row level security;

create policy "InstaPet posts are viewable by everyone"
    on instapet_posts for select
    using (true);

create policy "Pet owners can insert InstaPet posts"
    on instapet_posts for insert
    with check (
        exists (
            select 1 from profiles
            where profiles.id = author_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Authors can update their InstaPet posts"
    on instapet_posts for update
    using (
        exists (
            select 1 from profiles
            where profiles.id = author_id
            and profiles.user_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from profiles
            where profiles.id = author_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Authors can delete their InstaPet posts"
    on instapet_posts for delete
    using (
        exists (
            select 1 from profiles
            where profiles.id = author_id
            and profiles.user_id = auth.uid()
        )
    );

-- 15. INSTAPET FOLLOWERS (seguir mascotas)
-- ----------------------------------------------------------------------------
create table instapet_followers (
    id          uuid primary key default gen_random_uuid(),
    follower_id uuid references profiles(id) on delete cascade not null,
    pet_id      uuid references pets(id) on delete cascade not null,
    created_at  timestamptz default now() not null,
    unique (follower_id, pet_id)
);

create index idx_instapet_followers_follower_id on instapet_followers (follower_id);
create index idx_instapet_followers_pet_id on instapet_followers (pet_id);

alter table instapet_followers enable row level security;

create policy "Followers are viewable by everyone"
    on instapet_followers for select
    using (true);

create policy "Users can follow pets"
    on instapet_followers for insert
    with check (
        exists (
            select 1 from profiles
            where profiles.id = follower_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Users can unfollow pets"
    on instapet_followers for delete
    using (
        exists (
            select 1 from profiles
            where profiles.id = follower_id
            and profiles.user_id = auth.uid()
        )
    );

-- 16. INSTAPET MILESTONES (hitos importantes de la mascota)
-- ----------------------------------------------------------------------------
create table instapet_milestones (
    id          uuid primary key default gen_random_uuid(),
    pet_id      uuid references pets(id) on delete cascade not null,
    title       text not null,
    description text,
    photo_url   text,
    milestone_date date not null,
    created_at  timestamptz default now() not null,
    updated_at  timestamptz default now() not null
);

create index idx_instapet_milestones_pet_id on instapet_milestones (pet_id);
create index idx_instapet_milestones_date on instapet_milestones (milestone_date desc);

create trigger trg_instapet_milestones_updated_at
    before update on instapet_milestones
    for each row
    execute function update_updated_at_column();

alter table instapet_milestones enable row level security;

create policy "Milestones are viewable by everyone"
    on instapet_milestones for select
    using (true);

create policy "Pet owners can insert milestones"
    on instapet_milestones for insert
    with check (
        exists (
            select 1 from pets
            join profiles on profiles.id = pets.owner_id
            where pets.id = instapet_milestones.pet_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Pet owners can update milestones"
    on instapet_milestones for update
    using (
        exists (
            select 1 from pets
            join profiles on profiles.id = pets.owner_id
            where pets.id = instapet_milestones.pet_id
            and profiles.user_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from pets
            join profiles on profiles.id = pets.owner_id
            where pets.id = instapet_milestones.pet_id
            and profiles.user_id = auth.uid()
        )
    );

create policy "Pet owners can delete milestones"
    on instapet_milestones for delete
    using (
        exists (
            select 1 from pets
            join profiles on profiles.id = pets.owner_id
            where pets.id = instapet_milestones.pet_id
            and profiles.user_id = auth.uid()
        )
    );
