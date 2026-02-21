import { createClient } from "@supabase/supabase-js";
import { put } from "@vercel/blob";
import { config } from "dotenv";
import { resolve } from "path";
import { BEACHES } from "./data/index";

// Load .env.local (Next.js convention) before anything reads process.env
config({ path: resolve(process.cwd(), ".env.local") });

// ============================================
// Configuration
// ============================================
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;
const PLACES_BASE = "https://places.googleapis.com/v1";
const MAX_PHOTOS_PER_BEACH = 5;
const RATE_LIMIT_MS = 1500; // 1.5s between API calls

// ============================================
// Google Places API helpers
// ============================================
async function searchPlace(query: string): Promise<unknown | null> {
  const res = await fetch(`${PLACES_BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_API_KEY,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.location,places.rating,places.userRatingCount,places.photos",
    },
    body: JSON.stringify({
      textQuery: query,
      locationBias: {
        circle: {
          center: { latitude: 41.67, longitude: -70.3 },
          radius: 50000,
        },
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error(`Text Search failed for "${query}": ${res.status} — ${errBody}`);
    return null;
  }

  const data = await res.json() as { places?: unknown[] };
  return data.places?.[0] ?? null;
}

async function fetchPhotoBytes(
  photoName: string,
  maxWidth = 1200
): Promise<{ bytes: Buffer; contentType: string } | null> {
  const url = `${PLACES_BASE}/${photoName}/media?maxWidthPx=${maxWidth}&key=${GOOGLE_API_KEY}`;
  const res = await fetch(url, { redirect: "follow" });

  if (!res.ok) {
    console.error(`Photo fetch failed for ${photoName}: ${res.status}`);
    return null;
  }

  const bytes = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  return { bytes, contentType };
}

// ============================================
// Main seed function
// ============================================
async function seed() {
  console.log(`\n🏖️  Cape Cod Beach Guide — Seeding ${BEACHES.length} beaches\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < BEACHES.length; i++) {
    const beach = BEACHES[i];
    console.log(`[${i + 1}/${BEACHES.length}] Searching: ${beach.searchQuery}...`);

    const place = await searchPlace(beach.searchQuery) as Record<string, unknown> | null;
    if (!place) {
      console.error(`  ❌ Not found, skipping`);
      failed++;
      await sleep(RATE_LIMIT_MS);
      continue;
    }

    const placeId = place.id as string;
    const displayName = (place.displayName as { text?: string } | undefined)?.text ?? beach.searchQuery;
    const location = place.location as { latitude?: number; longitude?: number } | undefined;
    const lat = beach.latitude ?? location?.latitude;
    const lng = beach.longitude ?? location?.longitude;
    const rating = place.rating as number | null ?? null;
    const ratingCount = place.userRatingCount as number ?? 0;

    console.log(`  ✅ Found: ${displayName} (${placeId})`);

    const { error: beachError } = await supabase.from("beaches").upsert({
      id: placeId,
      name: displayName,
      town: beach.town,
      region: beach.region,
      island: beach.island,
      lat,
      lng,
      beach_type: beach.beachType,
      best_for: beach.bestFor,
      access_type: beach.accessType,
      parking_info: beach.parkingInfo ?? null,
      description: beach.description ?? null,
      is_active: true,

      // Expanded fields — written only when present in seed data
      ...(beach.waterBody !== undefined              && { water_body: beach.waterBody }),
      ...(beach.avgSummerWaterTempF !== undefined    && { avg_water_temp_f: beach.avgSummerWaterTempF }),
      ...(beach.waveIntensity !== undefined           && { wave_intensity: beach.waveIntensity }),
      ...(beach.tidalVariation !== undefined          && { tidal_variation: beach.tidalVariation }),
      ...(beach.sharkRisk !== undefined               && { shark_risk: beach.sharkRisk }),
      ...(beach.jellyfishRisk !== undefined           && { jellyfish_risk: beach.jellyfishRisk }),
      ...(beach.lifeguards !== undefined              && { lifeguards: beach.lifeguards.available }),
      ...(beach.lifeguards !== undefined              && { lifeguard_season: beach.lifeguards.season }),
      ...(beach.lifeguards !== undefined              && { lifeguard_hours: beach.lifeguards.hours }),
      ...(beach.restrooms !== undefined               && { restrooms: beach.restrooms }),
      ...(beach.showers !== undefined                 && { showers: beach.showers }),
      ...(beach.changingRooms !== undefined           && { changing_rooms: beach.changingRooms }),
      ...(beach.bikeRack !== undefined                && { bike_rack: beach.bikeRack }),
      ...(beach.volleyballCourt !== undefined         && { volleyball_court: beach.volleyballCourt }),
      ...(beach.foodNearby !== undefined              && { food_nearby: beach.foodNearby }),
      ...(beach.wheelchairAccessible !== undefined   && { wheelchair_accessible: beach.wheelchairAccessible }),
      ...(beach.dogPolicy !== undefined               && { dog_policy_allowed: beach.dogPolicy.allowed }),
      ...(beach.dogPolicy !== undefined               && { dog_policy_details: beach.dogPolicy.details }),
      ...(beach.dailyParkingFee !== undefined         && { daily_parking_fee: beach.dailyParkingFee }),
      ...(beach.residentStickerCost !== undefined     && { resident_sticker_cost: beach.residentStickerCost }),
      ...(beach.nonResidentSeasonalCost !== undefined && { non_resident_seasonal_cost: beach.nonResidentSeasonalCost }),
      ...(beach.parkingCapacity !== undefined         && { parking_capacity: beach.parkingCapacity }),
      ...(beach.parkingEnforcement !== undefined      && { parking_enforcement: beach.parkingEnforcement }),
      ...(beach.crowdLevel !== undefined              && { crowd_level: beach.crowdLevel }),
      ...(beach.beachLengthMiles !== undefined        && { beach_length_miles: beach.beachLengthMiles }),
      ...(beach.sunsetView !== undefined              && { sunset_view: beach.sunsetView }),
      ...(beach.bestArrivalTime !== undefined         && { best_arrival_time: beach.bestArrivalTime }),
      ...(beach.sandType !== undefined                && { sand_type: beach.sandType }),
      ...(beach.shadeAvailable !== undefined          && { shade_available: beach.shadeAvailable }),
      ...(beach.townBeachUrl !== undefined            && { town_beach_url: beach.townBeachUrl }),
      ...(beach.phone !== undefined                   && { phone: beach.phone }),
    });

    if (beachError) {
      console.error(`  ❌ DB insert failed:`, beachError.message);
      failed++;
      continue;
    }

    await supabase.from("beach_ratings").upsert({
      beach_id: placeId,
      rating,
      rating_count: ratingCount,
      refreshed_at: new Date().toISOString(),
    });

    const photos = ((place.photos as unknown[]) ?? []).slice(0, MAX_PHOTOS_PER_BEACH);
    console.log(`  📸 Caching ${photos.length} photos...`);

    for (let pi = 0; pi < photos.length; pi++) {
      const photo = photos[pi] as Record<string, unknown>;
      const photoName = photo.name as string;

      const result = await fetchPhotoBytes(photoName);
      if (!result) continue;

      const blobPath = `beaches/${placeId}/photo-${pi}.jpg`;
      const blob = await put(blobPath, result.bytes, {
        access: "public",
        contentType: result.contentType,
        allowOverwrite: true,
      });

      const attributions = photo.authorAttributions as Array<{ displayName?: string; uri?: string }> | undefined;
      const attribution = attributions?.[0]?.displayName ?? "Google Maps User";
      const attributionUrl = attributions?.[0]?.uri ?? null;

      await supabase.from("beach_photos").upsert(
        {
          beach_id: placeId,
          photo_index: pi,
          storage_url: blob.url,
          attribution,
          attribution_url: attributionUrl,
          width: (photo.widthPx as number | undefined) ?? null,
          height: (photo.heightPx as number | undefined) ?? null,
          cached_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        { onConflict: "beach_id,photo_index" }
      );

      await sleep(500);
    }

    success++;
    console.log(`  ✅ Done: ${displayName}\n`);
    await sleep(RATE_LIMIT_MS);
  }

  console.log(`\n========================================`);
  console.log(`Seeding complete: ${success} succeeded, ${failed} failed`);
  console.log(`========================================\n`);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

seed().catch(console.error);
