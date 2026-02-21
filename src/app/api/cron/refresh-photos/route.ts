import { createClient } from "@supabase/supabase-js";
import { put, del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;
const PLACES_BASE = "https://places.googleapis.com/v1";
const MAX_PHOTOS = 5;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find photos that are expired or expiring within 3 days
  const cutoff = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

  // Get beaches with expired photos
  const { data: expiredPhotos } = await supabase
    .from("beach_photos")
    .select("beach_id")
    .lt("expires_at", cutoff);

  const beachIds = Array.from(
    new Set((expiredPhotos || []).map((p) => p.beach_id))
  );

  if (beachIds.length === 0) {
    return NextResponse.json({ message: "No photos need refresh" });
  }

  let refreshed = 0;

  for (const beachId of beachIds) {
    try {
      // Step 1: Get fresh photo_name tokens from Place Details
      // (old tokens expire — you MUST re-fetch from Place Details)
      const detailRes = await fetch(`${PLACES_BASE}/places/${beachId}`, {
        headers: {
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask": "photos",
        },
      });

      if (!detailRes.ok) continue;
      const detail = await detailRes.json();
      const photos = (detail.photos || []).slice(0, MAX_PHOTOS);

      // Step 2: Delete old blobs
      const { data: oldPhotos } = await supabase
        .from("beach_photos")
        .select("storage_url")
        .eq("beach_id", beachId);

      for (const old of oldPhotos || []) {
        try {
          await del(old.storage_url);
        } catch {
          // Blob may already be gone
        }
      }

      // Step 3: Fetch fresh photo bytes and re-upload
      for (let pi = 0; pi < photos.length; pi++) {
        const photo = photos[pi];
        const mediaUrl = `${PLACES_BASE}/${photo.name}/media?maxWidthPx=1200&key=${GOOGLE_API_KEY}`;
        const mediaRes = await fetch(mediaUrl, { redirect: "follow" });
        if (!mediaRes.ok) continue;

        const bytes = Buffer.from(await mediaRes.arrayBuffer());
        const contentType =
          mediaRes.headers.get("content-type") || "image/jpeg";

        const blob = await put(`beaches/${beachId}/photo-${pi}.jpg`, bytes, {
          access: "public",
          contentType,
        });

        const attribution =
          photo.authorAttributions?.[0]?.displayName || "Google Maps User";
        const attributionUrl = photo.authorAttributions?.[0]?.uri || null;

        await supabase.from("beach_photos").upsert(
          {
            beach_id: beachId,
            photo_index: pi,
            storage_url: blob.url,
            attribution,
            attribution_url: attributionUrl,
            width: photo.widthPx || null,
            height: photo.heightPx || null,
            cached_at: new Date().toISOString(),
            expires_at: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          { onConflict: "beach_id,photo_index" }
        );

        await new Promise((r) => setTimeout(r, 500));
      }

      refreshed++;
      await new Promise((r) => setTimeout(r, 2000));
    } catch (e) {
      console.error(`Failed to refresh photos for ${beachId}:`, e);
    }
  }

  return NextResponse.json({
    message: `Photos refreshed for ${refreshed}/${beachIds.length} beaches`,
    timestamp: new Date().toISOString(),
  });
}