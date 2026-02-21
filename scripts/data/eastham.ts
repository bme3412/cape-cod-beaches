import type { BeachSeed } from "./types";

const beaches: BeachSeed[] = [
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
];

export default beaches;
