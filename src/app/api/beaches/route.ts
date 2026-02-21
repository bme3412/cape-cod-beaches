import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Optional filters
  const island = searchParams.get("island");       // cape_cod, nantucket, marthas_vineyard
  const region = searchParams.get("region");        // upper_cape, mid_cape, etc.
  const beachType = searchParams.get("type");       // ocean_surf, bay_calm, etc.
  const bestFor = searchParams.get("bestFor");      // surfing, families, etc.
  const search = searchParams.get("q");             // free text search on name/town

  // Query the beach_directory view (joins beaches + ratings + photos)
  let query = supabase.from("beach_directory").select("*");

  if (island) query = query.eq("island", island);
  if (region) query = query.eq("region", region);
  if (beachType) query = query.eq("beach_type", beachType);
  if (bestFor) query = query.contains("best_for", [bestFor]);
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,town.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Set aggressive caching headers — this data barely changes
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}