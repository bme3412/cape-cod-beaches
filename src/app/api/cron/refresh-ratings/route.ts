import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;
const PLACES_BASE = "https://places.googleapis.com/v1";

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all active beaches
  const { data: beaches, error } = await supabase
    .from("beaches")
    .select("id, name")
    .eq("is_active", true);

  if (error || !beaches) {
    return NextResponse.json(
      { error: "Failed to fetch beaches" },
      { status: 500 }
    );
  }

  let updated = 0;
  let failed = 0;

  for (const beach of beaches) {
    try {
      // Use Place Details (New) with just rating fields — very cheap
      const res = await fetch(`${PLACES_BASE}/places/${beach.id}`, {
        headers: {
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask": "rating,userRatingCount",
        },
      });

      if (!res.ok) {
        failed++;
        continue;
      }

      const place = await res.json();

      await supabase.from("beach_ratings").upsert({
        beach_id: beach.id,
        rating: place.rating || null,
        rating_count: place.userRatingCount || 0,
        refreshed_at: new Date().toISOString(),
      });

      updated++;

      // Rate limit: 1.5s between calls
      await new Promise((r) => setTimeout(r, 1500));
    } catch (e) {
      console.error(`Failed to refresh rating for ${beach.name}:`, e);
      failed++;
    }
  }

  return NextResponse.json({
    message: `Ratings refreshed: ${updated} updated, ${failed} failed`,
    timestamp: new Date().toISOString(),
  });
}