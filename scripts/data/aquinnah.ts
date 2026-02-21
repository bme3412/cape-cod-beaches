import type { BeachSeed } from "./types";

const beaches: BeachSeed[] = [
  {
    searchQuery: "Aquinnah Beach Moshup Beach Martha's Vineyard MA",
    town: "Aquinnah",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "ocean_surf",
    bestFor: ["scenery", "cliffs", "nature"],
    accessType: "public",
    parkingInfo: "Town lot $20/day, shuttle from Gay Head Cliffs overlook",
    description:
      "Below the famous Gay Head Cliffs — dramatic red, orange, and white clay cliffs that are among the most photographed landmarks in New England. The beach itself has strong waves and a wild, untouched feeling.",
  },
  {
    searchQuery: "Lobsterville Beach Aquinnah Martha's Vineyard MA",
    town: "Aquinnah",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "bay_calm",
    bestFor: ["fishing", "seclusion", "walking"],
    accessType: "public",
    parkingInfo: "Roadside, limited",
    description:
      "A long, lonely stretch of sand on Menemsha Pond with views of the Elizabeth Islands. Popular with surf fishermen chasing striped bass and bluefish. Rarely crowded.",
  },
];

export default beaches;
