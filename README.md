# Cape Cod Beach Guide

A curated, photography-forward directory of the best beaches on Cape Cod, MA — powered by a smart caching layer so every user request is **zero Google API calls**.

## Architecture

```
User request
    ↓
Next.js (Vercel)
    ↓
Supabase (Postgres) — beaches + beach_photos + beach_ratings
    ↑
Vercel Cron Jobs (weekly ratings, monthly photos)
    ↑
Google Places API (New)
    ↑
Vercel Blob (photo storage)
```

**Cost: ~$0.88/month regardless of traffic.**

## Quick Start

### 1. Clone & Install

```bash
git clone <repo>
cd cape-cod-beaches
npm install
```

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `GOOGLE_MAPS_API_KEY` | Places API (New) — server only |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (secret) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token |
| `CRON_SECRET` | Random secret for cron auth — `openssl rand -hex 32` |
| `NEXT_PUBLIC_BASE_URL` | Your deployed URL |

### 3. Database Setup

Run `supabase/schema.sql` in your Supabase SQL editor. This creates:
- `beaches` — the beach directory
- `beach_photos` — Vercel Blob URLs + attribution + cache expiry
- `beach_ratings` — Google rating + review count

### 4. Seed the Database

This is a **one-time operation** that calls Google Places API to populate 26 beaches:

```bash
npm run seed
```

This will:
1. Text-search each beach to get its `place_id`
2. Fetch place details to get photo resource tokens
3. Download up to 5 photos per beach to Vercel Blob
4. Upsert everything to Supabase

### 5. Run Locally

```bash
npm run dev
```

## Cron Jobs

Configured in `vercel.json` and secured with `Authorization: Bearer <CRON_SECRET>`.

| Cron | Schedule | What it does |
|---|---|---|
| `/api/cron/refresh-ratings` | Every Monday 6 AM UTC | Cheap metadata refresh — rating + review count |
| `/api/cron/refresh-photos` | 1st of each month 4 AM UTC | Re-fetches fresh photo tokens → downloads new bytes → updates Blob |

> **Why re-fetch tokens?** Google Places photo `name` tokens expire. We always call Place Details first to get fresh tokens before downloading photo bytes.

## Google Places API Rules

- **NEVER** call Places API in `/api/beaches` or any user-facing route
- **ONLY** call in `scripts/seed.ts` and the two cron routes
- Always store photo bytes in Vercel Blob — never proxy from Google
- Always persist `authorAttributions[].displayName` per Google ToS

## Tech Stack

- **Next.js 14** (App Router) on Vercel
- **Supabase** (Postgres) for data
- **Vercel Blob** for photo storage
- **Google Places API (New)** — cron-only
- **Tailwind CSS** — light coastal design system
- Fonts: Playfair Display (headings) + DM Mono (metadata)

## Design System

| Token | Value |
|---|---|
| Background | `#faf8f5` (warm off-white) |
| Ocean blue | `#0077b6` |
| Sand | `#e9c46a` |
| Seafoam | `#52b788` |
| Heading font | Playfair Display (serif) |
| Meta font | DM Mono (monospace) |

## Cache Freshness Indicators

Each beach card shows a colored dot for photo freshness:
- 🟢 Green — cached < 7 days ago
- 🟡 Yellow — cached 7–20 days ago  
- 🔴 Red — cached > 20 days ago (will be refreshed on next cron run)
