import type { BeachSeed } from "./types";

const beaches: BeachSeed[] = [
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
];

export default beaches;
