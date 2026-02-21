import type { BeachSeed } from "./types";

const beaches: BeachSeed[] = [
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
];

export default beaches;
