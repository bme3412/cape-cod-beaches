import type { BeachSeed } from "./types";

const beaches: BeachSeed[] = [
  {
    searchQuery: "State Beach Joseph Sylvia Beach Martha's Vineyard MA",
    town: "Oak Bluffs",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "sound",
    bestFor: ["families", "calm water", "biking"],
    accessType: "public",
    parkingInfo: "Roadside parking along Beach Road, free",
    description:
      "A two-mile stretch of calm, warm water along the road between Oak Bluffs and Edgartown. Featured in 'Jaws' — the bridge scene was filmed at the drawbridge nearby. Easy access, easy swimming.",
  },
  {
    searchQuery: "Inkwell Beach Oak Bluffs Martha's Vineyard MA",
    town: "Oak Bluffs",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "sound",
    bestFor: ["families", "town access", "history"],
    accessType: "public",
    parkingInfo: "Town parking nearby, walkable",
    description:
      "A beloved small beach in the heart of Oak Bluffs with deep cultural significance as a historic gathering place for the Black community on Martha's Vineyard. Calm water, right near the shops and restaurants.",
  },
  {
    searchQuery: "Oak Bluffs Town Beach Martha's Vineyard MA",
    town: "Oak Bluffs",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "harbor",
    bestFor: ["families", "town access", "convenience"],
    accessType: "public",
    parkingInfo: "Town parking, walkable from ferry",
    description:
      "Right in the heart of Oak Bluffs near the ferry terminal and downtown. Calm harbor water and total convenience — grab lunch, take a swim, browse the shops. Not scenic, but incredibly accessible.",
  },
];

export default beaches;
