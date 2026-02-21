import type { BeachSeed } from "./types";

const beaches: BeachSeed[] = [
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
];

export default beaches;
