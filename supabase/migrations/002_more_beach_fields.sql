-- Migration 002 — Additional beach detail fields
-- Run this in the Supabase SQL editor after 001.
-- All columns are nullable.

alter table beaches
  -- Water & conditions
  add column if not exists tidal_variation       text check (tidal_variation in ('low','moderate','high')),
  add column if not exists jellyfish_risk        text,

  -- Facilities
  add column if not exists changing_rooms        boolean,
  add column if not exists bike_rack             boolean,
  add column if not exists volleyball_court      boolean,

  -- Parking details
  add column if not exists resident_sticker_cost         integer,
  add column if not exists non_resident_seasonal_cost    integer,
  add column if not exists parking_capacity              text check (parking_capacity in ('small','medium','large')),
  add column if not exists parking_enforcement           text,

  -- Planning details
  add column if not exists best_arrival_time     text,
  add column if not exists sand_type             text,
  add column if not exists shade_available       text,

  -- Contact & official info
  add column if not exists town_beach_url        text,
  add column if not exists phone                 text;
