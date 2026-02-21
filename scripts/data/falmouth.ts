import type { BeachSeed } from "./types";

const beaches: BeachSeed[] = [
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
];

export default beaches;
