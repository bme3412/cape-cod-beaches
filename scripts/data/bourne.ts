import type { BeachSeed } from "./types";

const beaches: BeachSeed[] = [
  {
    searchQuery: "Monument Beach Bourne MA",
    town: "Bourne",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "calm water", "fishing"],
    accessType: "sticker_required",
    parkingInfo: "Town parking, sticker or daily fee",
    description:
      "A quiet, family-friendly bay beach that's one of the first stops after crossing the bridge. Calm, warm water and a laid-back vibe that feels like the real Cape before the tourist corridor kicks in.",
  },
  {
    searchQuery: "Sagamore Beach Bourne MA",
    town: "Bourne",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["walking", "seclusion", "canal views"],
    accessType: "sticker_required",
    parkingInfo: "Resident sticker required, very limited street parking",
    description:
      "A long, narrow Cape Cod Bay beach just north of the canal. Rocky in spots but with great walking stretches and views of the Sagamore Bridge. Feels more like a neighborhood secret than a tourist beach.",
  },
  {
    searchQuery: "Barlows Landing Beach Pocasset Bourne MA",
    town: "Bourne",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "calm water", "kayaking"],
    accessType: "sticker_required",
    parkingInfo: "Resident sticker required",
    description:
      "A small, protected beach on Buzzards Bay in the Pocasset village of Bourne. Calm water and a neighborhood feel make this one of Bourne's quieter gems. Popular with kayakers launching from the landing.",
  },
];

export default beaches;
