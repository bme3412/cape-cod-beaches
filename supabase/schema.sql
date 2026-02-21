-- Cape Cod Beach Guide — Database Schema
-- Run this in your Supabase SQL editor to create all tables.

-- ─── beaches ──────────────────────────────────────────────────────────────────
create table if not exists beaches (
  id           text primary key,        -- Google place_id (stable anchor)
  name         text not null,
  town         text not null,
  lat          double precision not null,
  lng          double precision not null,
  beach_type   text not null check (beach_type in ('ocean','bay','dunes','national_seashore','harbor')),
  best_for     text[] not null default '{}',
  description  text not null default '',
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- ─── beach_photos ──────────────────────────────────────────────────────────────
create table if not exists beach_photos (
  id           bigserial primary key,
  beach_id     text not null references beaches(id) on delete cascade,
  photo_index  int not null,            -- 0 = primary, 1-4 = gallery
  storage_url  text not null,           -- Vercel Blob URL
  attribution  text,                    -- authorAttributions displayName (Google ToS)
  cached_at    timestamptz not null default now(),
  expires_at   timestamptz not null default (now() + interval '30 days'),
  unique (beach_id, photo_index)
);

create index if not exists beach_photos_beach_id_idx on beach_photos(beach_id);

-- ─── beach_ratings ─────────────────────────────────────────────────────────────
create table if not exists beach_ratings (
  id            bigserial primary key,
  beach_id      text not null references beaches(id) on delete cascade unique,
  rating        numeric(2,1),
  rating_count  int,
  refreshed_at  timestamptz not null default now()
);

create index if not exists beach_ratings_beach_id_idx on beach_ratings(beach_id);

-- ─── Row Level Security ────────────────────────────────────────────────────────
-- All tables are public-read (anon key can read, service key can write)

alter table beaches enable row level security;
alter table beach_photos enable row level security;
alter table beach_ratings enable row level security;

create policy "Public read beaches"
  on beaches for select using (true);

create policy "Public read beach_photos"
  on beach_photos for select using (true);

create policy "Public read beach_ratings"
  on beach_ratings for select using (true);
