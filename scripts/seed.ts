import { createClient } from "@supabase/supabase-js";
import { put } from "@vercel/blob";
import { config } from "dotenv";
import { resolve } from "path";

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
  // ================================================================
  //  UPPER CAPE — Bourne
  // ================================================================
  {
    searchQuery: "Monument Beach Bourne MA",
    town: "Bourne",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "calm water", "fishing"],
    accessType: "sticker_required",
    parkingInfo: "Town parking, sticker or daily fee",
    description:
      "A quiet, family-friendly bay beach that's one of the first stops after crossing the bridge. Calm, warm water and a laid-back vibe that feels like the real Cape before the tourist corridor kicks in.",
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
    searchQuery: "Sagamore Beach Bourne MA",
    town: "Bourne",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["walking", "seclusion", "canal views"],
    accessType: "sticker_required",
    parkingInfo: "Resident sticker required, very limited street parking",
    description:
      "A long, narrow Cape Cod Bay beach just north of the canal. Rocky in spots but with great walking stretches and views of the Sagamore Bridge. Feels more like a neighborhood secret than a tourist beach.",
  },
  {
    searchQuery: "Barlows Landing Beach Pocasset Bourne MA",
    town: "Bourne",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "calm water", "kayaking"],
    accessType: "sticker_required",
    parkingInfo: "Resident sticker required",
    description:
      "A small, protected beach on Buzzards Bay in the Pocasset village of Bourne. Calm water and a neighborhood feel make this one of Bourne's quieter gems. Popular with kayakers launching from the landing.",
  },

  // ================================================================
  //  UPPER CAPE — Sandwich
  // ================================================================
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
  {
    searchQuery: "East Sandwich Beach Sandwich MA",
    town: "Sandwich",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["walking", "seclusion", "nature"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, small lot",
    description:
      "A quieter alternative to Town Neck on Cape Cod Bay. Rockier than most Cape beaches — a Sandwich signature caused by the canal disrupting natural sand flow — but beautiful for walking and beachcombing.",
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

  // ================================================================
  //  UPPER CAPE — Falmouth
  // ================================================================
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
    searchQuery: "Menauhant Beach East Falmouth MA",
    town: "Falmouth",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "warm water", "swimming"],
    accessType: "sticker_required",
    parkingInfo: "Daily parking available, sticker or fee",
    description:
      "A popular Nantucket Sound beach in East Falmouth with warm water and gentle waves. The jetties create a protected swimming area. One of the few Falmouth beaches where day passes are readily available.",
  },
  {
    searchQuery: "Falmouth Heights Beach Falmouth MA",
    town: "Falmouth",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "town access", "swimming"],
    accessType: "public",
    parkingInfo: "Street parking, limited — walk or bike recommended",
    description:
      "A lively neighborhood beach right in Falmouth Heights with views across Vineyard Sound to Martha's Vineyard. Walk to restaurants and ice cream shops on Grand Avenue. Free to access, but parking is tight.",
  },
  {
    searchQuery: "Wood Neck Beach Falmouth MA",
    town: "Falmouth",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "calm water", "seclusion"],
    accessType: "sticker_required",
    parkingInfo: "Resident sticker only",
    description:
      "A quiet Buzzards Bay beach tucked between Sippewissett and West Falmouth. Protected waters and a serene setting. Resident-only parking keeps it uncrowded even on peak summer days.",
  },
  {
    searchQuery: "Bristol Beach Falmouth MA",
    town: "Falmouth",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["walking", "seclusion"],
    accessType: "sticker_required",
    parkingInfo: "Resident sticker required, small lot",
    description:
      "A narrow strip of sand on Vineyard Sound that connects to Surf Drive Beach. Less crowded than its famous neighbor and a great spot for a long beach walk with Vineyard views.",
  },

  // ================================================================
  //  UPPER CAPE — Mashpee
  // ================================================================
  {
    searchQuery: "South Cape Beach State Park Mashpee MA",
    town: "Mashpee",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["nature", "walking", "swimming"],
    accessType: "public",
    parkingInfo: "State park parking, fee varies — town lot requires sticker",
    description:
      "Mashpee's only ocean beach — a barrier beach on Nantucket Sound backed by the Waquoit Bay National Estuarine Reserve. Feels wild and undeveloped compared to neighboring Falmouth beaches. Great birding.",
  },

  // ================================================================
  //  UPPER CAPE — Barnstable (Centerville, Cotuit, Osterville, Hyannis)
  // ================================================================
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
    searchQuery: "Covell's Beach Centerville MA",
    town: "Centerville",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "calm water"],
    accessType: "sticker_required",
    parkingInfo: "Resident sticker required",
    description:
      "Right next to Craigville but far less crowded thanks to the resident-only parking. Same warm Nantucket Sound water, same great sand — just a fraction of the people. The locals' version of Craigville.",
  },
  {
    searchQuery: "Long Beach Centerville MA",
    town: "Centerville",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["walking", "seclusion", "beachcombing"],
    accessType: "sticker_required",
    parkingInfo: "Resident sticker only, two tiny lots that fill by 9am",
    description:
      "A serious hidden gem with spectacular sand. Multiple small inlets on the east end teem with hermit crabs and snails at low tide. No facilities, no crowds — just beautiful beach.",
  },
  {
    searchQuery: "Loop Beach Cotuit MA",
    town: "Cotuit",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "calm water", "swimming"],
    accessType: "sticker_required",
    parkingInfo: "Resident sticker required, lifeguards and bathhouse",
    description:
      "A charming Nantucket Sound beach in the village of Cotuit with calm, roped-off swimming areas and full facilities including a bathhouse. Small-town beach vibes at their best — the kind of place where everyone knows each other.",
  },
  {
    searchQuery: "Ropes Beach Cotuit MA",
    town: "Cotuit",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["seclusion", "walking"],
    accessType: "sticker_required",
    parkingInfo: "Resident sticker only, very limited",
    description:
      "A tiny, quiet beach on Old Shore Road in Cotuit. No facilities, no fanfare — just a sliver of sand on Nantucket Sound for residents who want a peaceful escape.",
  },
  {
    searchQuery: "Dowses Beach Osterville MA",
    town: "Osterville",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "fishing", "kayaking"],
    accessType: "sticker_required",
    parkingInfo: "Sticker or daily fee, lifeguards in summer",
    description:
      "Osterville's main beach on East Bay with a dock, rock jetties for fishing, and views of the harbor. Calm, warm water and a distinctly upscale Osterville vibe. Great for families and kayakers alike.",
  },
  {
    searchQuery: "Kalmus Beach Hyannis MA",
    town: "Hyannis",
    region: "upper_cape",
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
    region: "upper_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "playground", "picnics"],
    accessType: "public",
    parkingInfo: "Free public parking",
    description:
      "Hyannis's most accessible beach — free parking, a playground, picnic areas, and a bathhouse. Calm water and full amenities make it the go-to for families who don't want to deal with sticker hassles.",
  },
  {
    searchQuery: "Keyes Beach Sea Street Beach Hyannis MA",
    town: "Hyannis",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "town access", "swimming"],
    accessType: "public",
    parkingInfo: "Daily parking available",
    description:
      "Also known as Sea Street Beach, this is a popular Hyannis beach on Nantucket Sound. Short walk from downtown shops and restaurants. Lifeguards, restrooms, and a solid family beach experience.",
  },
  {
    searchQuery: "Millway Beach Barnstable MA",
    town: "Barnstable",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "harbor",
    bestFor: ["families", "harbor views", "fishing"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, moderate lot",
    description:
      "A bay-side beach in Barnstable Village near the harbor. Watch fishing boats and whale-watching tours come and go. Calm water with a view of Sandy Neck across the harbor.",
  },
  {
    searchQuery: "Eugenia Fortes Beach Hyannisport MA",
    town: "Hyannisport",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "calm water"],
    accessType: "sticker_required",
    parkingInfo: "Resident sticker only",
    description:
      "A small neighborhood beach in Hyannisport on Nantucket Sound. Quiet, residential feel in the shadow of the Kennedy Compound. Resident-only access keeps it peaceful.",
  },

  // ================================================================
  //  MID CAPE — Yarmouth
  // ================================================================
  {
    searchQuery: "Seagull Beach West Yarmouth MA",
    town: "Yarmouth",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "teens", "swimming"],
    accessType: "sticker_required",
    parkingInfo: "Large lot, daily fee or sticker",
    description:
      "Yarmouth's largest and most popular beach. Soft, white sand stretching along Nantucket Sound with panoramic views. Snack bar, lifeguards, and full facilities. A favorite with teens and families alike.",
  },
  {
    searchQuery: "Smugglers Beach Bass River Beach South Yarmouth MA",
    town: "Yarmouth",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "fishing", "picnics"],
    accessType: "public",
    parkingInfo: "Daily fee, large lot with boat ramp",
    description:
      "Sitting at the mouth of Bass River with a fishing pier, snack bar, and boat ramp. Calm water, great views, and a spacious viewing platform. Hosts outdoor movie nights in summer.",
  },
  {
    searchQuery: "Parkers River Beach South Yarmouth MA",
    town: "Yarmouth",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "playground", "music"],
    accessType: "public",
    parkingInfo: "Daily fee, good-sized lot",
    description:
      "A family favorite on Nantucket Sound with a playground, concession stand, and a gazebo that hosts a summer music series. The concrete seawall walk is great for strolling.",
  },
  {
    searchQuery: "Seaview Beach South Yarmouth MA",
    town: "Yarmouth",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["relaxation", "quiet"],
    accessType: "sticker_required",
    parkingInfo: "Daily fee or sticker",
    description:
      "A quieter alternative to the big Yarmouth beaches with powder-soft sand, calm surf, and pretty views of Nantucket Sound. Seawall walkway with bench seating.",
  },
  {
    searchQuery: "Bass Hole Beach Grays Beach Yarmouth Port MA",
    town: "Yarmouth",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["boardwalk", "nature", "sunset", "families"],
    accessType: "public",
    parkingInfo: "Paid seasonal parking, picnic area",
    description:
      "Yarmouth's only bay-side beach, famous for its long boardwalk over a salt marsh teeming with wildlife. The beach itself is small, but the boardwalk views and sunset from here are spectacular. Great for kids exploring tidal pools.",
  },
  {
    searchQuery: "Englewood Beach West Yarmouth MA",
    town: "Yarmouth",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "harbor",
    bestFor: ["families", "toddlers", "calm water"],
    accessType: "public",
    parkingInfo: "Free, limited",
    description:
      "A tiny, protected beach on Lewis Bay with extremely calm water — ideal for toddlers. Adjacent to the Yarmouth Sailing Center. Not great for serious swimming, but perfect for small children splashing around.",
  },
  {
    searchQuery: "Colonial Acres Beach West Yarmouth MA",
    town: "Yarmouth",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "harbor",
    bestFor: ["families", "calm water", "quiet"],
    accessType: "sticker_required",
    parkingInfo: "Small lot, seasonal porta-john",
    description:
      "A quiet neighborhood beach on Lewis Bay with calm water and minimal crowds. A wooden bridge and marina views add charm. Under the radar even by Yarmouth standards.",
  },
  {
    searchQuery: "Bayview Beach West Yarmouth MA",
    town: "Yarmouth",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "harbor",
    bestFor: ["relaxation", "boat watching"],
    accessType: "sticker_required",
    parkingInfo: "Small lot at end of Bay View Street",
    description:
      "A mid-sized beach overlooking the entrance to Hyannis Marina. Not much foot traffic — just a relaxing spot to watch boats pass and enjoy calm water. A local favorite for quiet mornings.",
  },

  // ================================================================
  //  MID CAPE — Dennis
  // ================================================================
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
    searchQuery: "Sea Street Beach Dennis Port MA",
    town: "Dennis",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "swimming"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, small lot",
    description:
      "A compact sound-side beach in Dennis Port with warm water and a neighborhood feel. Jetties on either side create a protected swimming area.",
  },
  {
    searchQuery: "Howes Street Beach Dennis MA",
    town: "Dennis",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "tidal flats", "quiet"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, small lot",
    description:
      "A quieter alternative to Mayflower and Corporation beaches with the same gorgeous tidal flats. Small parking lot keeps the crowds manageable. Classic Dennis bay beach experience.",
  },
  {
    searchQuery: "Cold Storage Beach Dennis MA",
    town: "Dennis",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["walking", "seclusion", "nature"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, very limited parking",
    description:
      "Named after a long-gone ice house, this bay beach sits near the Sesuit Harbor area. Smaller and less visited than the big Dennis bay beaches, with great walking at low tide.",
  },
  {
    searchQuery: "Bayview Beach Dennis MA",
    town: "Dennis",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "calm water"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, small lot",
    description:
      "A small bay beach near Corporation Beach with calm water and a laid-back atmosphere. A good overflow option when the more popular Dennis bay beaches fill up.",
  },
  {
    searchQuery: "Haigis Beach Dennis Port MA",
    town: "Dennis",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "swimming"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required",
    description:
      "A Dennis Port sound-side beach with warm Nantucket Sound water. Small and family-oriented with a relaxed residential neighborhood surrounding it.",
  },
  {
    searchQuery: "Glendon Road Beach Dennis Port MA",
    town: "Dennis",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "warm water"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, small lot",
    description:
      "One of Dennis Port's many small neighborhood beaches on Nantucket Sound. Warm water, easy access, and a true locals' spot.",
  },
  {
    searchQuery: "Inman Road Beach Dennis Port MA",
    town: "Dennis",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "swimming"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, small lot",
    description:
      "A small neighborhood beach on Nantucket Sound in Dennis Port. Not flashy, but warm water and easy access make it a solid family option.",
  },

  // ================================================================
  //  MID CAPE — Brewster
  // ================================================================
  {
    searchQuery: "Breakwater Beach Brewster MA",
    town: "Brewster",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "tidal flats", "sunset"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, largest lot in Brewster (~100 spaces)",
    description:
      "Brewster's most popular beach with the town's biggest parking lot. The legendary Brewster Flats stretch nearly a mile at low tide — a vast, surreal sandscape perfect for skimboarding, walking, and exploring tidal pools.",
  },
  {
    searchQuery: "Paines Creek Beach Brewster MA",
    town: "Brewster",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "sunset", "creek exploring"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, limited parking",
    description:
      "Many locals' pick for the best beach in Brewster. Fed by a tidal creek that kids love wading in, and the sunset views where creek meets bay are extraordinary. The Brewster Flats here go on forever.",
  },
  {
    searchQuery: "Crosby Landing Beach Brewster MA",
    town: "Brewster",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["walking", "tidal flats", "sunset"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, ~75 spaces",
    description:
      "A wide bay beach in East Brewster near the historic Crosby Mansion. Over half a mile of sand that expands to nearly a mile at low tide. Wonderful for swimming, picnicking, and sunset watching.",
  },
  {
    searchQuery: "Linnell Landing Beach Brewster MA",
    town: "Brewster",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["seclusion", "tidal flats", "quiet"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, small lot",
    description:
      "A quieter Brewster bay landing with a more intimate feel. The small lot keeps crowds down. At low tide, the flats connect to Crosby Landing for an epic walk.",
  },
  {
    searchQuery: "Ellis Landing Beach Brewster MA",
    town: "Brewster",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["seclusion", "sunset", "quiet"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, small lot",
    description:
      "Tucked among seaside cottages and Ocean Edge Resort, Ellis Landing has a private-beach feel with spectacular sunsets. Small and quiet — perfect when you want Brewster's beauty without Breakwater's crowds.",
  },
  {
    searchQuery: "Point of Rocks Beach Brewster MA",
    town: "Brewster",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["seclusion", "quiet"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, virtually no parking",
    description:
      "A hidden gem at the end of a dead-end road. Nice, quiet, and virtually unknown. Almost no parking means it's best reached by bike — but that's part of the charm.",
  },
  {
    searchQuery: "Saints Landing Beach Brewster MA",
    town: "Brewster",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["tidal flats", "quiet", "walking"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, small lot",
    description:
      "A small, narrow beach that expands for miles when the tide goes out, exposing the famous Brewster Flats. Quiet and uncrowded — one of Brewster's lesser-known landings.",
  },
  {
    searchQuery: "Robbins Hill Beach Brewster MA",
    town: "Brewster",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["quiet", "walking"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, very limited",
    description:
      "A pretty, quiet bay beach off Lower Road. Like all Brewster beaches, it's incredible at low tide when the flats seem to go on forever. A true locals' spot.",
  },

  // ================================================================
  //  MID CAPE — Harwich
  // ================================================================
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
  {
    searchQuery: "Bank Street Beach Harwich MA",
    town: "Harwich",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "paddleboarding", "kayaking"],
    accessType: "sticker_required",
    parkingInfo: "Sticker or daily fee",
    description:
      "A Nantucket Sound beach close to shopping and amenities in Harwich Port. Ideal for paddleboarding, swimming, and kayaking. Slightly warmer water than the Atlantic-facing beaches.",
  },
  {
    searchQuery: "Pleasant Road Beach Harwich MA",
    town: "Harwich",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "swimming"],
    accessType: "sticker_required",
    parkingInfo: "Sticker or daily fee",
    description:
      "A well-maintained Nantucket Sound beach in Harwich Port. Warm water, good facilities, and easy access from Route 28. A reliable family beach option.",
  },
  {
    searchQuery: "Earle Road Beach Harwich MA",
    town: "Harwich",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "quiet"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, small lot",
    description:
      "A smaller, quieter Harwich beach on Nantucket Sound. Less parking means fewer people — a good option for families who want warm water without the crowds of Red River.",
  },

  // ================================================================
  //  MID CAPE — Chatham
  // ================================================================
  {
    searchQuery: "Lighthouse Beach Chatham MA",
    town: "Chatham",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "ocean_surf",
    bestFor: ["seals", "scenery", "lighthouse"],
    accessType: "public",
    parkingInfo: "Park at Chatham Lighthouse lot, walk down",
    description:
      "Below the iconic Chatham Lighthouse with front-row seats to hundreds of seals lounging on the outer bars. Strong currents make swimming inadvisable, but the wildlife show is unbeatable. Shark sightings are common.",
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
    searchQuery: "Cockle Cove Beach Chatham MA",
    town: "Chatham",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "toddlers", "calm water"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required",
    description:
      "Very calm, very warm, very shallow — essentially a giant wading pool for small children. Protected by the outer beach, the water here barely gets above knee-deep for a long way out. Chatham's best toddler beach.",
  },
  {
    searchQuery: "Forest Beach Chatham MA",
    town: "Chatham",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "quiet"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, small lot",
    description:
      "A small, residential sound-side beach in South Chatham. Warm, calm water and limited parking keep it peaceful. A genuine neighborhood beach.",
  },

  // ================================================================
  //  MID CAPE — Orleans
  // ================================================================
  {
    searchQuery: "Nauset Beach Orleans MA",
    town: "Orleans",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "ocean_surf",
    bestFor: ["surfing", "bodyboarding", "long walks"],
    accessType: "sticker_required",
    parkingInfo: "Daily parking $25, large lot that fills by 10am in summer",
    description:
      "Ten miles of wild Atlantic barrier beach — one of the Cape's most iconic stretches of sand. Serious surf, strong currents, and a raw ocean energy that makes you feel small. Consistently ranked among America's best beaches.",
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
    searchQuery: "Rock Harbor Beach Orleans MA",
    town: "Orleans",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["sunset", "fishing", "harbor views"],
    accessType: "public",
    parkingInfo: "Limited parking near the harbor",
    description:
      "More of a harbor landing than a traditional beach, but the sunset from Rock Harbor is legendary. Watch charter fishing boats return with the day's catch as the sky turns gold over Cape Cod Bay.",
  },

  // ================================================================
  //  LOWER CAPE — Eastham
  // ================================================================
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
    searchQuery: "Nauset Light Beach Eastham MA",
    town: "Eastham",
    region: "lower_cape",
    island: "cape_cod",
    beachType: "national_seashore",
    bestFor: ["swimming", "scenery", "lighthouse"],
    accessType: "national_seashore_pass",
    parkingInfo: "National Seashore pass or $25/day per vehicle",
    description:
      "Dramatic ocean beach beneath the iconic Nauset Lighthouse — the one on the Cape Cod chips bag. The clay cliffs glow orange at sunset. Strong currents and big waves — this is real Atlantic Ocean swimming.",
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
    searchQuery: "Campground Beach Eastham MA",
    town: "Eastham",
    region: "lower_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "calm water", "sunset"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, small lot",
    description:
      "A family-friendly bay beach with calm, warm water and beautiful sunsets. Less heralded than First Encounter, which works in its favor — easier to find a spot on busy days.",
  },
  {
    searchQuery: "Thumpertown Beach Eastham MA",
    town: "Eastham",
    region: "lower_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "sunset", "quiet"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, small lot",
    description:
      "Named after a local character, this bay beach offers the same spectacular sunset views as First Encounter with smaller crowds. Calm water and tidal flats make it another great family option.",
  },
  {
    searchQuery: "Cooks Brook Beach Eastham MA",
    town: "Eastham",
    region: "lower_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "calm water"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, small lot",
    description:
      "A North Eastham bay beach with calm water and a quiet atmosphere. Less well-known than the big Eastham beaches, which means easier parking and fewer crowds.",
  },
  {
    searchQuery: "Sunken Meadow Beach Eastham MA",
    town: "Eastham",
    region: "lower_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "sunset", "quiet"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, small lot",
    description:
      "A peaceful Eastham bay beach with excellent sunset views. The name comes from the meadow behind the beach that floods at high tide. Another quiet alternative to First Encounter.",
  },

  // ================================================================
  //  LOWER CAPE — Wellfleet
  // ================================================================
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
    searchQuery: "LeCount Hollow Beach Wellfleet MA",
    town: "Wellfleet",
    region: "lower_cape",
    island: "cape_cod",
    beachType: "ocean_surf",
    bestFor: ["surfing", "seclusion"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, small lot",
    description:
      "Also known as Maguire Landing, this ocean beach is the quietest of Wellfleet's surf beaches. Same dramatic dunes and good waves, but with fewer people vying for parking spots.",
  },
  {
    searchQuery: "Duck Harbor Beach Wellfleet MA",
    town: "Wellfleet",
    region: "lower_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["sunset", "seclusion", "nature"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, limited lot",
    description:
      "A remote bay beach at the end of a long road through pine forest. The sunset here rivals First Encounter, but far fewer people know about it. The drive in feels like entering another world.",
  },
  {
    searchQuery: "Mayo Beach Wellfleet MA",
    town: "Wellfleet",
    region: "lower_cape",
    island: "cape_cod",
    beachType: "harbor",
    bestFor: ["families", "town access", "calm water"],
    accessType: "public",
    parkingInfo: "Town center parking, free",
    description:
      "Right in Wellfleet center near the harbor and town pier. More of a town beach than a destination beach — a convenient spot for a quick swim between gallery hopping and oyster eating.",
  },
  {
    searchQuery: "Indian Neck Beach Wellfleet MA",
    town: "Wellfleet",
    region: "lower_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "calm water", "sunset"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required",
    description:
      "A calm bay beach on the inner harbor side of Wellfleet. Warm water, easy swimming, and good sunset views. A favorite for Wellfleet families who want bay-side calm without the drive to Duck Harbor.",
  },
  {
    searchQuery: "Powers Landing Beach Wellfleet MA",
    town: "Wellfleet",
    region: "lower_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["seclusion", "quiet"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, minimal parking",
    description:
      "A tiny bay-side landing that barely registers as a beach, but locals love its quiet seclusion. Minimal parking keeps it almost private feeling.",
  },

  // ================================================================
  //  OUTER CAPE — Truro
  // ================================================================
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
    searchQuery: "Fisher Beach Truro MA",
    town: "Truro",
    region: "outer_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["sunset", "seclusion", "quiet"],
    accessType: "sticker_required",
    parkingInfo: "Truro sticker only, very limited",
    description:
      "A tiny, secluded bay beach that's one of Truro's best-kept secrets. Calm water, gorgeous sunsets, and virtually no one around. You need a Truro sticker and local knowledge to find it.",
  },
  {
    searchQuery: "Ryder Beach Truro MA",
    town: "Truro",
    region: "outer_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "sunset", "calm water"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, small lot",
    description:
      "A calm bay beach in North Truro with good sunset views and warm water. Less dramatic than the ocean side, but perfect for families who want easy swimming and Truro's quiet character.",
  },

  // ================================================================
  //  OUTER CAPE — Provincetown
  // ================================================================
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
  {
    searchQuery: "Long Point Beach Provincetown MA",
    town: "Provincetown",
    region: "outer_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["seclusion", "walking", "nature"],
    accessType: "public",
    parkingInfo: "Accessible by foot (1.5-mile walk on breakwater) or boat",
    description:
      "At the very tip of the Cape's curled fist, accessible only by walking the stone breakwater or taking a water taxi. The reward is near-total seclusion and pristine bay swimming. The walk across the breakwater is an adventure in itself.",
  },
  {
    searchQuery: "Provincetown Harbor Beach Commercial Street MA",
    town: "Provincetown",
    region: "outer_cape",
    island: "cape_cod",
    beachType: "harbor",
    bestFor: ["town access", "swimming", "convenience"],
    accessType: "public",
    parkingInfo: "Town parking lots, metered street parking",
    description:
      "Steps from Commercial Street shops and restaurants. The harbor beach (also called Flyer's Beach) is nothing fancy, but the convenience of swimming and then walking to lunch is hard to beat in P-town.",
  },

  // ================================================================
  //  NANTUCKET
  // ================================================================
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
    searchQuery: "Brant Point Beach Nantucket MA",
    town: "Nantucket",
    region: "nantucket",
    island: "nantucket",
    beachType: "harbor",
    bestFor: ["families", "lighthouse", "ferry watching"],
    accessType: "public",
    parkingInfo: "Walk or bike from town",
    description:
      "Home to the iconic Brant Point Lighthouse — the second-oldest lighthouse in America. Watch ferries glide in and out of the harbor. Calm water, easy walk from town, and a Nantucket must-see.",
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
    searchQuery: "Sconset Beach Siasconset Nantucket MA",
    town: "Nantucket",
    region: "nantucket",
    island: "nantucket",
    beachType: "ocean_surf",
    bestFor: ["village charm", "scenery", "walking"],
    accessType: "public",
    parkingInfo: "Street parking in Sconset village",
    description:
      "The beach below the charming village of Siasconset (Sconset), known for its rose-covered cottages. Dramatic bluffs with active erosion — some houses teetering on the edge. Strong surf and a wild, beautiful setting.",
  },
  {
    searchQuery: "Eel Point Beach Nantucket MA",
    town: "Nantucket",
    region: "nantucket",
    island: "nantucket",
    beachType: "bay_calm",
    bestFor: ["nature", "seclusion", "birding"],
    accessType: "public",
    parkingInfo: "Small lot, walk or bike along Eel Point Road",
    description:
      "A remote north shore beach requiring a sandy road walk to access. The spit of land at Eel Point is a prime birding spot where Nantucket Sound meets the open harbor. Pristine and wild.",
  },
  {
    searchQuery: "Ladies Beach Nantucket MA",
    town: "Nantucket",
    region: "nantucket",
    island: "nantucket",
    beachType: "ocean_surf",
    bestFor: ["walking", "seclusion"],
    accessType: "public",
    parkingInfo: "Small lot",
    description:
      "Tucked between Surfside and Cisco on the south shore. Less known and less visited than its famous neighbors. Named for the Victorian-era practice of gender-segregated swimming.",
  },
  {
    searchQuery: "Tom Nevers Beach Nantucket MA",
    town: "Nantucket",
    region: "nantucket",
    island: "nantucket",
    beachType: "ocean_surf",
    bestFor: ["seclusion", "walking", "fishing"],
    accessType: "public",
    parkingInfo: "End of Tom Nevers Road, limited",
    description:
      "The easternmost south shore beach, far from the main tourist areas. Strong surf and a remote, windswept character. Excellent for surf fishing and long, solitary walks.",
  },
  {
    searchQuery: "Quidnet Beach Nantucket MA",
    town: "Nantucket",
    region: "nantucket",
    island: "nantucket",
    beachType: "ocean_surf",
    bestFor: ["seclusion", "scenery"],
    accessType: "public",
    parkingInfo: "Small lot at end of Quidnet Road",
    description:
      "A remote east shore beach where Sesachacha Pond nearly meets the ocean. Dramatic scenery where freshwater and saltwater worlds collide. Few visitors make it out here, which is the appeal.",
  },

  // ================================================================
  //  MARTHA'S VINEYARD — Edgartown
  // ================================================================
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
    searchQuery: "Lighthouse Beach Edgartown Martha's Vineyard MA",
    town: "Edgartown",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "harbor",
    bestFor: ["families", "lighthouse", "town access"],
    accessType: "public",
    parkingInfo: "Walk from downtown Edgartown",
    description:
      "A small beach at the foot of the Edgartown Lighthouse with harbor views and calm water. Walk from downtown, snap a photo of the lighthouse, and wade in. The quintessential Edgartown experience.",
  },
  {
    searchQuery: "Fuller Street Beach Edgartown Martha's Vineyard MA",
    town: "Edgartown",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "harbor",
    bestFor: ["families", "calm water", "town access"],
    accessType: "public",
    parkingInfo: "Street parking, walk from town",
    description:
      "A small, calm harbor beach walkable from Edgartown center. Protected water makes it ideal for young swimmers. Not fancy, but the convenience of being steps from town is the draw.",
  },
  {
    searchQuery: "Bend in the Road Beach Edgartown Martha's Vineyard MA",
    town: "Edgartown",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "sound",
    bestFor: ["families", "calm water", "biking"],
    accessType: "public",
    parkingInfo: "Bike path parking, bike from town recommended",
    description:
      "Right on the bike path between Edgartown and Oak Bluffs. Calm Nantucket Sound water and easy bike access make it a natural stop. A practical, no-fuss family beach.",
  },
  {
    searchQuery: "Norton Point Beach Edgartown Martha's Vineyard MA",
    town: "Edgartown",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "ocean_surf",
    bestFor: ["fishing", "off-road", "seclusion"],
    accessType: "public",
    parkingInfo: "Trustees property, 4WD permit required",
    description:
      "A barrier beach connecting South Beach to Chappaquiddick, accessible by 4WD with a Trustees permit. Remote Atlantic beach with excellent surf fishing. One of the wildest stretches of sand on the Vineyard.",
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

  // ================================================================
  //  MARTHA'S VINEYARD — Oak Bluffs
  // ================================================================
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
    searchQuery: "Oak Bluffs Town Beach Martha's Vineyard MA",
    town: "Oak Bluffs",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "harbor",
    bestFor: ["families", "town access", "convenience"],
    accessType: "public",
    parkingInfo: "Town parking, walkable from ferry",
    description:
      "Right in the heart of Oak Bluffs near the ferry terminal and downtown. Calm harbor water and total convenience — grab lunch, take a swim, browse the shops. Not scenic, but incredibly accessible.",
  },

  // ================================================================
  //  MARTHA'S VINEYARD — Vineyard Haven
  // ================================================================
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
    searchQuery: "Lake Tashmoo Beach Vineyard Haven Martha's Vineyard MA",
    town: "Vineyard Haven",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "sound",
    bestFor: ["families", "calm water", "nature"],
    accessType: "public",
    parkingInfo: "Small lot, fills early",
    description:
      "Where Lake Tashmoo meets Vineyard Sound — you can swim in fresh or salt water within steps. A beautiful, lesser-known spot that locals love. Limited parking keeps it peaceful.",
  },

  // ================================================================
  //  MARTHA'S VINEYARD — Chilmark
  // ================================================================
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
    searchQuery: "Lucy Vincent Beach Chilmark Martha's Vineyard MA",
    town: "Chilmark",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "ocean_surf",
    bestFor: ["scenery", "cliffs", "seclusion"],
    accessType: "residents_only",
    parkingInfo: "Chilmark residents and renters only — strictly enforced",
    description:
      "Dramatic clay cliffs, pristine sand, and powerful surf. Widely considered one of the most beautiful beaches in New England, but access is limited to Chilmark residents and renters. The south section is clothing-optional.",
  },
  {
    searchQuery: "Squibnocket Beach Chilmark Martha's Vineyard MA",
    town: "Chilmark",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "ocean_surf",
    bestFor: ["surfing", "scenery", "seclusion"],
    accessType: "residents_only",
    parkingInfo: "Chilmark residents only",
    description:
      "The Vineyard's best surf break, backed by stunning scenery. Resident-only access keeps it uncrowded. The rocky shoreline and big waves make this a surfer's paradise — not a gentle swim spot.",
  },

  // ================================================================
  //  MARTHA'S VINEYARD — Aquinnah
  // ================================================================
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

  // ================================================================
  //  MARTHA'S VINEYARD — West Tisbury
  // ================================================================
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
    beachType: "sound",
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
          radius: 50000, // 50km max allowed by Places API (New)
        },
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error(`Text Search failed for "${query}": ${res.status} — ${errBody}`);
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
        allowOverwrite: true,
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