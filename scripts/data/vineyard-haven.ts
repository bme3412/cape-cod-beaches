import type { BeachSeed } from "./types";

const beaches: BeachSeed[] = [
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
];

export default beaches;
