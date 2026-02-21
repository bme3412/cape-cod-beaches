import type { BeachSeed } from "./types";

const beaches: BeachSeed[] = [
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
];

export default beaches;
