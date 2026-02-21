import { createClient } from "@supabase/supabase-js";
import { put } from "@vercel/blob";
import "dotenv/config";

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
const RATE_LIMIT_MS = 1500; // 1.5s between API calls to stay safe

// ============================================
// Beach seed data
// ============================================
interface BeachSeed {
  searchQuery: string; // what to send to Google Text Search
  town: string;
  region: string;
  island: string;
  beachType: string;
  bestFor: string[];
  accessType: string;
  parkingInfo?: string;
  description?: string;
}

const BEACHES: BeachSeed[] = [
  // ---- UPPER CAPE ----
  {
    searchQuery: "Old Silver Beach Falmouth MA",
    town: "Falmouth",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "sunset", "swimming"],
    accessType: "sticker_required",
    parkingInfo: "Daily parking $30, sticker required for residents",
    description:
      "The crown jewel of Falmouth's bay-side beaches. Warm, calm water and legendary sunsets make this the Cape's best family beach. The sandbar at low tide creates a natural wading pool that kids go crazy for.",
  },
  {
    searchQuery: "Surf Drive Beach Falmouth MA",
    town: "Falmouth",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "windsurfing", "cycling"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, limited daily passes available",
    description:
      "Right off the Shining Sea Bikeway with views of Martha's Vineyard. Warmer sound-side water and a wide sandy beach. The bike path connection makes it easy to beach-hop without a car.",
  },
  {
    searchQuery: "Sandy Neck Beach Barnstable MA",
    town: "Barnstable",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "dunes",
    bestFor: ["walking", "nature", "off-road", "dogs"],
    accessType: "sticker_required",
    parkingInfo: "ORV permits available, gatehouse parking $20/day",
    description:
      "Six miles of pristine barrier beach with towering dunes and protected wildlife habitat. One of the only Cape beaches where you can drive on the sand with an ORV permit. A nature lover's paradise.",
  },
  {
    searchQuery: "Craigville Beach Centerville MA",
    town: "Centerville",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "swimming", "teens"],
    accessType: "sticker_required",
    parkingInfo: "Large lot, sticker or daily fee",
    description:
      "The Cape's unofficial 'main beach' — big, popular, and social. Warm Nantucket Sound water, decent-sized waves, and a vibrant summer scene. Locals call it 'Muscle Beach.'",
  },
  {
    searchQuery: "Scusset Beach Sandwich MA",
    town: "Sandwich",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "ocean_surf",
    bestFor: ["camping", "fishing", "canal trail"],
    accessType: "public",
    parkingInfo: "State reservation parking, $15/day",
    description:
      "A state reservation beach at the mouth of the Cape Cod Canal. Great for fishing off the jetty, and the only Cape beach with proper oceanfront camping. The canal bike path starts right here.",
  },
  {
    searchQuery: "Monument Beach Bourne MA",
    town: "Bourne",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "calm water", "fishing"],
    accessType: "public",
    parkingInfo: "Town parking, sticker or daily fee",
    description:
      "A quiet, family-friendly bay beach that's one of the first stops after crossing the bridge. Calm, warm water and a laid-back vibe that feels like the real Cape before the tourist corridor kicks in.",
  },
  {
    searchQuery: "Chapoquoit Beach West Falmouth MA",
    town: "Falmouth",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["sunset", "seclusion", "walking"],
    accessType: "sticker_required",
    parkingInfo: "Resident sticker only, very limited parking",
    description:
      "A local secret on Buzzards Bay. Small and quiet with postcard sunsets. Limited parking keeps the crowds down — this is where Falmouth residents go when they want their own beach.",
  },
  {
    searchQuery: "Town Neck Beach Sandwich MA",
    town: "Sandwich",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["walking", "boardwalk", "sunset"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required in season, boardwalk parking available",
    description:
      "Connected to the famous Sandwich Boardwalk over the marsh — the walk out to the beach is half the experience. Bay-side calm water with views of the canal and great sunset potential.",
  },

  // ---- MID CAPE ----
  {
    searchQuery: "Kalmus Beach Hyannis MA",
    town: "Hyannis",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["windsurfing", "families"],
    accessType: "public",
    parkingInfo: "Public parking lot, fills early in summer",
    description:
      "The windsurfing capital of Cape Cod. Consistent onshore breezes off Nantucket Sound make this the go-to for kiteboarding and windsurfing. The calm inner harbor side is perfect for families.",
  },
  {
    searchQuery: "Veterans Park Beach Hyannis MA",
    town: "Hyannis",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "playground", "picnics"],
    accessType: "public",
    parkingInfo: "Free public parking",
    description:
      "Hyannis's most accessible beach — free parking, a playground, picnic areas, and a bathhouse. Calm water and full amenities make it the go-to for families who don't want to deal with sticker hassles.",
  },
  {
    searchQuery: "Mayflower Beach Dennis MA",
    town: "Dennis",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "tidal flats", "sunset"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, $25 daily parking",
    description:
      "At low tide, you can walk a quarter mile out on the tidal flats — kids love hunting for hermit crabs and sand dollars. The bay-side sunsets here are genuinely world-class.",
  },
  {
    searchQuery: "Corporation Beach Dennis MA",
    town: "Dennis",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "calm water"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required in season",
    description:
      "One of Dennis's best bay beaches with warm, shallow water and a wide sand flat. Named after the corporation that once harvested salt here. Low-key and family-perfect.",
  },
  {
    searchQuery: "Chapin Memorial Beach Dennis MA",
    town: "Dennis",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["walking", "dogs off-season", "sunset"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, ORV permits available",
    description:
      "A long, narrow bay beach where you can drive on the sand with a permit. At low tide, it feels like the ocean disappeared and left a desert behind. Dogs allowed in the off-season.",
  },
  {
    searchQuery: "West Dennis Beach Dennis MA",
    town: "Dennis",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "windsurfing", "large beach"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, large parking lot",
    description:
      "One of the longest beaches on the south shore — over a mile of sand along Nantucket Sound. Big enough that it never feels packed. Great windsurfing on the west end.",
  },
  {
    searchQuery: "Skaket Beach Orleans MA",
    town: "Orleans",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "tidal flats", "sunset"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, daily parking $25",
    description:
      "The bay-side gem of Orleans. Massive tidal flats at low tide create warm, ankle-deep pools — like a natural water park for little kids. Sunsets here regularly stop traffic on Route 6A.",
  },
  {
    searchQuery: "Ridgevale Beach Chatham MA",
    town: "Chatham",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "warm water"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, daily passes at booth",
    description:
      "Protected by the outer barrier beach, so the water is warmer and calmer than the open ocean. A Chatham locals' favorite with a more relaxed vibe than the town beaches.",
  },
  {
    searchQuery: "Hardings Beach Chatham MA",
    town: "Chatham",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "lighthouse views"],
    accessType: "sticker_required",
    parkingInfo: "Sticker or daily parking",
    description:
      "A beautiful sound-side beach with views of Stage Harbor Lighthouse. The walk to the lighthouse point is a classic Chatham experience. Protected water makes it great for younger swimmers.",
  },
  {
    searchQuery: "Red River Beach Harwich MA",
    town: "Harwich",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "warm water", "swimming"],
    accessType: "sticker_required",
    parkingInfo: "Sticker or daily fee, decent-sized lot",
    description:
      "Harwich's top beach on Nantucket Sound. Consistently warm water, a long sandy stretch, and a neighborhood feel. Less flashy than some Cape beaches, which is exactly the point.",
  },

  // ---- LOWER / OUTER CAPE ----
  {
    searchQuery: "Nauset Light Beach Eastham MA",
    town: "Eastham",
    region: "lower_cape",
    island: "cape_cod",
    beachType: "national_seashore",
    bestFor: ["swimming", "scenery", "lighthouse"],
    accessType: "national_seashore_pass",
    parkingInfo: "National Seashore pass or $25/day per vehicle",
    description:
      "Dramatic ocean beach beneath the iconic Nauset Lighthouse. The clay cliffs glow orange at sunset. Strong currents and big waves — this is real Atlantic Ocean swimming.",
  },
  {
    searchQuery: "Coast Guard Beach Eastham MA",
    town: "Eastham",
    region: "lower_cape",
    island: "cape_cod",
    beachType: "national_seashore",
    bestFor: ["surfing", "bodyboarding", "seals"],
    accessType: "national_seashore_pass",
    parkingInfo: "Shuttle from Doane Rock lot in summer, $25/day",
    description:
      "Consistently rated one of the top 10 beaches in America. The old Coast Guard station sits above the beach, and you'll almost certainly see seals. Shuttle-only access in summer keeps it manageable.",
  },
  {
    searchQuery: "First Encounter Beach Eastham MA",
    town: "Eastham",
    region: "lower_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["sunset", "families", "history"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, fills fast at sunset",
    description:
      "Named for the Pilgrims' first encounter with the Nauset people in 1620. Now famous for having arguably the best sunset on Cape Cod — the sky over the bay turns impossible colors.",
  },
  {
    searchQuery: "Marconi Beach Wellfleet MA",
    town: "Wellfleet",
    region: "lower_cape",
    island: "cape_cod",
    beachType: "national_seashore",
    bestFor: ["swimming", "scenery", "dramatic cliffs"],
    accessType: "national_seashore_pass",
    parkingInfo: "National Seashore pass or $25/day",
    description:
      "Named for Guglielmo Marconi's wireless telegraph station. Towering sand cliffs drop to a wide Atlantic beach. The dramatic erosion here is a visible reminder that the Cape is always changing.",
  },
  {
    searchQuery: "Cahoon Hollow Beach Wellfleet MA",
    town: "Wellfleet",
    region: "lower_cape",
    island: "cape_cod",
    beachType: "ocean_surf",
    bestFor: ["surfing", "young crowd", "nightlife"],
    accessType: "sticker_required",
    parkingInfo: "Sticker or $25 daily, limited spots",
    description:
      "Home of the legendary Beachcomber bar and restaurant right on the bluff. The surf crowd and twenty-somethings flock here. Strong waves, high energy, and the closest thing the Cape has to a beach party scene.",
  },
  {
    searchQuery: "White Crest Beach Wellfleet MA",
    town: "Wellfleet",
    region: "lower_cape",
    island: "cape_cod",
    beachType: "ocean_surf",
    bestFor: ["surfing", "bodyboarding"],
    accessType: "sticker_required",
    parkingInfo: "Sticker or daily fee",
    description:
      "Wellfleet's premier surf beach. The biggest and most consistent waves on Cape Cod draw surfers from all over New England. Not for casual swimmers — this is serious ocean.",
  },
  {
    searchQuery: "Newcomb Hollow Beach Wellfleet MA",
    town: "Wellfleet",
    region: "lower_cape",
    island: "cape_cod",
    beachType: "ocean_surf",
    bestFor: ["surfing", "seclusion"],
    accessType: "sticker_required",
    parkingInfo: "Sticker only, small lot",
    description:
      "A quieter alternative to Cahoon Hollow and White Crest with equally good surf. Smaller lot means fewer people. Walking north, you can find stretches of beach entirely to yourself.",
  },
  {
    searchQuery: "Longnook Beach Truro MA",
    town: "Truro",
    region: "outer_cape",
    island: "cape_cod",
    beachType: "ocean_surf",
    bestFor: ["scenery", "dramatic cliffs", "seclusion"],
    accessType: "sticker_required",
    parkingInfo: "Truro sticker only, tiny lot",
    description:
      "Edward Hopper painted these cliffs. The steep staircase down to the beach rewards you with some of the most dramatic coastal scenery on the Eastern Seaboard. A Truro treasure.",
  },
  {
    searchQuery: "Head of the Meadow Beach Truro MA",
    town: "Truro",
    region: "outer_cape",
    island: "cape_cod",
    beachType: "national_seashore",
    bestFor: ["swimming", "nature", "quiet"],
    accessType: "national_seashore_pass",
    parkingInfo: "National Seashore pass or daily fee",
    description:
      "Split between town and National Seashore sections. Feels remote and wild — you can walk for miles. Less crowded than the Eastham and Wellfleet ocean beaches.",
  },
  {
    searchQuery: "Ballston Beach Truro MA",
    town: "Truro",
    region: "outer_cape",
    island: "cape_cod",
    beachType: "ocean_surf",
    bestFor: ["seclusion", "scenery"],
    accessType: "sticker_required",
    parkingInfo: "Truro sticker only",
    description:
      "Tucked between the dunes at the end of a narrow road. The Pamet River valley frames the approach. One of the most beautiful and least-visited ocean beaches on the Cape.",
  },
  {
    searchQuery: "Corn Hill Beach Truro MA",
    town: "Truro",
    region: "outer_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["sunset", "families", "calm"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, small lot",
    description:
      "Truro's bay-side beach where the Pilgrims found their first corn. Calm water, stunning sunsets, and a fraction of the crowds you'd find at the Dennis bay beaches.",
  },
  {
    searchQuery: "Race Point Beach Provincetown MA",
    town: "Provincetown",
    region: "outer_cape",
    island: "cape_cod",
    beachType: "national_seashore",
    bestFor: ["surfing", "whales", "sunset", "seclusion"],
    accessType: "national_seashore_pass",
    parkingInfo: "National Seashore pass or $25/day",
    description:
      "The very tip of Cape Cod where the Atlantic meets Cape Cod Bay. Whales surface offshore, and the sunset happens over the ocean — rare on the East Coast. Worth the drive to the end of Route 6.",
  },
  {
    searchQuery: "Herring Cove Beach Provincetown MA",
    town: "Provincetown",
    region: "outer_cape",
    island: "cape_cod",
    beachType: "national_seashore",
    bestFor: ["sunset", "swimming", "lgbtq-friendly"],
    accessType: "national_seashore_pass",
    parkingInfo: "National Seashore pass or $25/day, large lot",
    description:
      "P-town's most popular beach and one of the most welcoming on the Cape. West-facing for sunsets, calmer water than Race Point, and a wonderfully inclusive atmosphere. The south end is clothing-optional.",
  },

  // ---- NANTUCKET ----
  {
    searchQuery: "Jetties Beach Nantucket MA",
    town: "Nantucket",
    region: "nantucket",
    island: "nantucket",
    beachType: "harbor",
    bestFor: ["families", "playground", "calm water", "events"],
    accessType: "public",
    parkingInfo: "Free, walkable from town",
    description:
      "Nantucket's most accessible beach — a 15-minute walk from town with calm harbor water, a playground, snack bar, and tennis courts. Host of the annual Film Festival's beach screening.",
  },
  {
    searchQuery: "Children's Beach Nantucket MA",
    town: "Nantucket",
    region: "nantucket",
    island: "nantucket",
    beachType: "harbor",
    bestFor: ["toddlers", "playground", "calm water"],
    accessType: "public",
    parkingInfo: "Town center, walk or bike",
    description:
      "Right in Nantucket Harbor with water so calm it barely qualifies as the ocean. A grassy park with a playground, bandstand, and concession. Designed for the under-5 crowd.",
  },
  {
    searchQuery: "Steps Beach Nantucket MA",
    town: "Nantucket",
    region: "nantucket",
    island: "nantucket",
    beachType: "sound",
    bestFor: ["snorkeling", "seclusion", "walking"],
    accessType: "public",
    parkingInfo: "Street parking, bike recommended",
    description:
      "A hidden gem down a steep staircase near the Cliff area. Rocky shore with the best snorkeling on Nantucket. Small and quiet — the stairs keep the crowds away.",
  },
  {
    searchQuery: "Dionis Beach Nantucket MA",
    town: "Nantucket",
    region: "nantucket",
    island: "nantucket",
    beachType: "sound",
    bestFor: ["families", "calm water", "dunes"],
    accessType: "public",
    parkingInfo: "Small lot, fills by 10am in summer",
    description:
      "Nantucket's best-kept family secret. North shore location means calm, warm water. Surrounded by high dunes that block the wind and create natural privacy. Get there early.",
  },
  {
    searchQuery: "Cisco Beach Nantucket MA",
    town: "Nantucket",
    region: "nantucket",
    island: "nantucket",
    beachType: "ocean_surf",
    bestFor: ["surfing", "young crowd"],
    accessType: "public",
    parkingInfo: "Dirt lot, free",
    description:
      "Nantucket's surf beach. South-facing with consistent swells and a young, laid-back crowd. Close to Cisco Brewers, so the afternoon migration from beach to brewery is a well-worn path.",
  },
  {
    searchQuery: "Surfside Beach Nantucket MA",
    town: "Nantucket",
    region: "nantucket",
    island: "nantucket",
    beachType: "ocean_surf",
    bestFor: ["surfing", "bodyboarding", "biking"],
    accessType: "public",
    parkingInfo: "Lot at beach end, bike path from town",
    description:
      "The most popular south shore beach, easily reached by the bike path from town. Big waves, lifeguards, and a concession stand. The bike ride out is flat and gorgeous.",
  },
  {
    searchQuery: "Madaket Beach Nantucket MA",
    town: "Nantucket",
    region: "nantucket",
    island: "nantucket",
    beachType: "ocean_surf",
    bestFor: ["sunset", "surfing", "seclusion"],
    accessType: "public",
    parkingInfo: "Small lot at end of Madaket Road",
    description:
      "The westernmost point on Nantucket, famous for having the best sunset on the island. Strong currents and waves — more for watching than swimming. The 6-mile bike ride out is half the adventure.",
  },
  {
    searchQuery: "Great Point Beach Nantucket MA",
    town: "Nantucket",
    region: "nantucket",
    island: "nantucket",
    beachType: "dunes",
    bestFor: ["fishing", "seclusion", "nature", "off-road"],
    accessType: "public",
    parkingInfo: "4WD permit required, $250/season from Trustees",
    description:
      "A remote spit of sand at the northeastern tip of the island, accessible only by 4WD. A lighthouse, incredible fishing, and seals are the only company. This is Nantucket at its wildest.",
  },
  {
    searchQuery: "Nobadeer Beach Nantucket MA",
    town: "Nantucket",
    region: "nantucket",
    island: "nantucket",
    beachType: "ocean_surf",
    bestFor: ["surfing", "young crowd"],
    accessType: "public",
    parkingInfo: "Near airport, free lot",
    description:
      "Next to the airport, so you get the surreal experience of planes coming in low overhead while you surf. Big waves and a college-age crowd. Unofficial party beach of Nantucket.",
  },
  {
    searchQuery: "Miacomet Beach Nantucket MA",
    town: "Nantucket",
    region: "nantucket",
    island: "nantucket",
    beachType: "ocean_surf",
    bestFor: ["walking", "seclusion"],
    accessType: "public",
    parkingInfo: "Small lot off Miacomet Road",
    description:
      "A long, wide south shore beach that's less discovered than Surfside or Cisco. Great for long walks. The adjacent Miacomet Golf Club means the area stays undeveloped.",
  },

  // ---- MARTHA'S VINEYARD ----
  {
    searchQuery: "South Beach Katama Edgartown Martha's Vineyard MA",
    town: "Edgartown",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "ocean_surf",
    bestFor: ["surfing", "bodyboarding", "long walks"],
    accessType: "public",
    parkingInfo: "Free parking at Katama end, bike from Edgartown",
    description:
      "Three miles of Atlantic barrier beach with serious surf and wide open sand. The left side faces the ocean (big waves), the right side faces Katama Bay (calm water) — pick your adventure.",
  },
  {
    searchQuery: "State Beach Joseph Sylvia Beach Martha's Vineyard MA",
    town: "Oak Bluffs",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "sound",
    bestFor: ["families", "calm water", "biking"],
    accessType: "public",
    parkingInfo: "Roadside parking along Beach Road, free",
    description:
      "A two-mile stretch of calm, warm water along the road between Oak Bluffs and Edgartown. Featured in 'Jaws' — the bridge scene was filmed at the drawbridge nearby. Easy access, easy swimming.",
  },
  {
    searchQuery: "Inkwell Beach Oak Bluffs Martha's Vineyard MA",
    town: "Oak Bluffs",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "sound",
    bestFor: ["families", "town access", "history"],
    accessType: "public",
    parkingInfo: "Town parking nearby, walkable",
    description:
      "A beloved small beach in the heart of Oak Bluffs with deep cultural significance as a historic gathering place for the Black community on Martha's Vineyard. Calm water, right near the shops and restaurants.",
  },
  {
    searchQuery: "Menemsha Beach Chilmark Martha's Vineyard MA",
    town: "Chilmark",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "harbor",
    bestFor: ["sunset", "fishing village", "lobster rolls"],
    accessType: "public",
    parkingInfo: "Very limited, bike or shuttle recommended",
    description:
      "A working fishing village with the most photographed sunset on Martha's Vineyard. Watch the fishing boats come in, grab a lobster roll from Larsen's, and settle in for the show. Arrive early — parking is brutal.",
  },
  {
    searchQuery: "Aquinnah Beach Moshup Beach Martha's Vineyard MA",
    town: "Aquinnah",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "ocean_surf",
    bestFor: ["scenery", "cliffs", "nature"],
    accessType: "public",
    parkingInfo: "Town lot $20/day, shuttle from Gay Head Cliffs overlook",
    description:
      "Below the famous Gay Head Cliffs — dramatic red, orange, and white clay cliffs that are among the most photographed landmarks in New England. The beach itself has strong waves and a wild, untouched feeling.",
  },
  {
    searchQuery: "Lobsterville Beach Aquinnah Martha's Vineyard MA",
    town: "Aquinnah",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "bay_calm",
    bestFor: ["fishing", "seclusion", "walking"],
    accessType: "public",
    parkingInfo: "Roadside, limited",
    description:
      "A long, lonely stretch of sand on Menemsha Pond with views of the Elizabeth Islands. Popular with surf fishermen chasing striped bass and bluefish. Rarely crowded.",
  },
  {
    searchQuery: "Owen Park Beach Vineyard Haven Martha's Vineyard MA",
    town: "Vineyard Haven",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "harbor",
    bestFor: ["families", "town access", "calm water"],
    accessType: "public",
    parkingInfo: "Street parking in Vineyard Haven",
    description:
      "A tiny harbor beach right in Vineyard Haven where you can watch the ferries come and go. Barely more than a sandy cove, but the location and calm water make it perfect for a quick dip between errands.",
  },
  {
    searchQuery: "East Beach Chappaquiddick Martha's Vineyard MA",
    town: "Edgartown",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "ocean_surf",
    bestFor: ["seclusion", "nature", "wildlife"],
    accessType: "public",
    parkingInfo: "Trustees property, $3 Chappy Ferry + beach fee",
    description:
      "Take the tiny Chappy Ferry, then bike or drive to Cape Pogue Wildlife Refuge. Remote, wild Atlantic beach with nesting shorebirds, seals, and virtually no other people. The journey is part of the experience.",
  },
  {
    searchQuery: "Long Point Beach West Tisbury Martha's Vineyard MA",
    town: "West Tisbury",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "sound",
    bestFor: ["nature", "walking", "wildlife refuge"],
    accessType: "public",
    parkingInfo: "Trustees property, parking reservation may be required",
    description:
      "Part of the Long Point Wildlife Refuge. A walk through heath and dunes leads to a pristine beach on Tisbury Great Pond. Feels like the Vineyard a hundred years ago.",
  },
  {
    searchQuery: "Lambert's Cove Beach West Tisbury Martha's Vineyard MA",
    town: "West Tisbury",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "ocean_surf",
    bestFor: ["scenery", "seclusion", "soft sand"],
    accessType: "residents_only",
    parkingInfo: "West Tisbury residents only — strictly enforced",
    description:
      "Widely considered Martha's Vineyard's most beautiful beach, which is exactly why it's restricted to town residents. Soft white sand, overhanging trees, and crystalline water. If you know someone in West Tisbury, beg for an invite.",
  },
];

// ============================================
// Google Places API helpers
// ============================================
async function searchPlace(query: string): Promise<any | null> {
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
          center: { latitude: 41.67, longitude: -70.3 }, // center of Cape Cod
          radius: 80000, // 80km radius covers Cape + islands
        },
      },
    }),
  });

  if (!res.ok) {
    console.error(`Text Search failed for "${query}": ${res.status}`);
    return null;
  }

  const data = await res.json();
  return data.places?.[0] || null;
}

async function fetchPhotoBytes(
  photoName: string,
  maxWidth: number = 1200
): Promise<{ bytes: Buffer; contentType: string } | null> {
  const url = `${PLACES_BASE}/${photoName}/media?maxWidthPx=${maxWidth}&key=${GOOGLE_API_KEY}`;
  const res = await fetch(url, { redirect: "follow" });

  if (!res.ok) {
    console.error(`Photo fetch failed for ${photoName}: ${res.status}`);
    return null;
  }

  const bytes = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") || "image/jpeg";
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
    console.log(
      `[${i + 1}/${BEACHES.length}] Searching: ${beach.searchQuery}...`
    );

    // 1. Search for the place
    const place = await searchPlace(beach.searchQuery);
    if (!place) {
      console.error(`  ❌ Not found, skipping`);
      failed++;
      await sleep(RATE_LIMIT_MS);
      continue;
    }

    const placeId = place.id;
    const displayName = place.displayName?.text || beach.searchQuery;
    const lat = place.location?.latitude;
    const lng = place.location?.longitude;
    const rating = place.rating || null;
    const ratingCount = place.userRatingCount || 0;

    console.log(`  ✅ Found: ${displayName} (${placeId})`);

    // 2. Upsert beach record
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
      parking_info: beach.parkingInfo || null,
      description: beach.description || null,
      is_active: true,
    });

    if (beachError) {
      console.error(`  ❌ DB insert failed:`, beachError.message);
      failed++;
      continue;
    }

    // 3. Upsert rating
    await supabase.from("beach_ratings").upsert({
      beach_id: placeId,
      rating,
      rating_count: ratingCount,
      refreshed_at: new Date().toISOString(),
    });

    // 4. Fetch and cache photos
    const photos = (place.photos || []).slice(0, MAX_PHOTOS_PER_BEACH);
    console.log(`  📸 Caching ${photos.length} photos...`);

    for (let pi = 0; pi < photos.length; pi++) {
      const photo = photos[pi];
      const photoName = photo.name; // e.g. "places/ABC/photos/XYZ"

      const result = await fetchPhotoBytes(photoName);
      if (!result) continue;

      // Upload to Vercel Blob
      const blobPath = `beaches/${placeId}/photo-${pi}.jpg`;
      const blob = await put(blobPath, result.bytes, {
        access: "public",
        contentType: result.contentType,
      });

      // Get attribution
      const attribution =
        photo.authorAttributions?.[0]?.displayName || "Google Maps User";
      const attributionUrl =
        photo.authorAttributions?.[0]?.uri || null;

      // Upsert photo record
      await supabase.from("beach_photos").upsert(
        {
          beach_id: placeId,
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

      await sleep(500); // pace photo fetches
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

// Run
seed().catch(console.error);