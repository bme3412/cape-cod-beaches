-- Migration 001 — Expanded beach fields
-- Run this in the Supabase SQL editor.
-- All new columns are nullable so existing rows are unaffected.

alter table beaches
  -- Already added by seed (may exist): region, island, access_type, parking_info
  add column if not exists region            text,
  add column if not exists island            text,
  add column if not exists access_type       text,
  add column if not exists parking_info      text,

  -- Water & conditions
  add column if not exists water_body        text,
  add column if not exists avg_water_temp_f  text,
  add column if not exists wave_intensity    text check (wave_intensity in ('calm','moderate','surf')),
  add column if not exists shark_risk        text check (shark_risk in ('low','moderate','elevated')),

  -- Facilities
  add column if not exists lifeguards           boolean,
  add column if not exists lifeguard_season     text,
  add column if not exists lifeguard_hours      text,
  add column if not exists restrooms            boolean,
  add column if not exists showers              boolean,
  add column if not exists food_nearby          text,
  add column if not exists wheelchair_accessible boolean,

  -- Dog policy
  add column if not exists dog_policy_allowed   boolean,
  add column if not exists dog_policy_details   text,

  -- Practical planning
  add column if not exists crowd_level          text check (crowd_level in ('low','moderate','high')),
  add column if not exists daily_parking_fee    integer,
  add column if not exists beach_length_miles   numeric(5,2),
  add column if not exists sunset_view          boolean;
