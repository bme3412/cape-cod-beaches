import type { BeachSeed } from "./types";

const beaches: BeachSeed[] = [
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
];

export default beaches;
