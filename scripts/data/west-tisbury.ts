import type { BeachSeed } from "./types";

const beaches: BeachSeed[] = [
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

export default beaches;
