import type { BeachSeed } from "./types";

const beaches: BeachSeed[] = [
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
];

export default beaches;
