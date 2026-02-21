import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Missing env vars", url: !!supabaseUrl, key: !!supabaseKey },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { searchParams } = new URL(req.url);
  const beachType = searchParams.get("type");
  const bestFor = searchParams.get("bestFor");
  const search = searchParams.get("q");

  // Fetch all active beaches
  let beachQuery = supabase
    .from("beaches")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (beachType) beachQuery = beachQuery.eq("beach_type", beachType);
  if (bestFor) beachQuery = beachQuery.contains("best_for", [bestFor]);
  if (search) beachQuery = beachQuery.or(`name.ilike.%${search}%,town.ilike.%${search}%`);

  const { data: beaches, error: beachError } = await beachQuery;
  if (beachError) {
    return NextResponse.json({ error: beachError.message }, { status: 500 });
  }

  if (!beaches || beaches.length === 0) {
    return NextResponse.json([], {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  }

  const beachIds = beaches.map((b) => b.id);

  // Fetch photos and ratings for all beaches in two queries
  const [{ data: photos }, { data: ratings }] = await Promise.all([
    supabase
      .from("beach_photos")
      .select("*")
      .in("beach_id", beachIds)
      .order("photo_index"),
    supabase
      .from("beach_ratings")
      .select("*")
      .in("beach_id", beachIds),
  ]);

  // Join in memory
  type PhotoRow = NonNullable<typeof photos>[0];
  type RatingRow = NonNullable<typeof ratings>[0];

  const photosByBeach = (photos ?? []).reduce<Record<string, PhotoRow[]>>((acc, p) => {
    if (!acc[p.beach_id]) acc[p.beach_id] = [];
    acc[p.beach_id].push(p);
    return acc;
  }, {});

  const ratingsById = (ratings ?? []).reduce<Record<string, RatingRow>>((acc, r) => {
    acc[r.beach_id] = r;
    return acc;
  }, {});

  const result = beaches.map((beach) => ({
    ...beach,
    photos: photosByBeach[beach.id] ?? [],
    rating: ratingsById[beach.id] ?? null,
  }));

  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
