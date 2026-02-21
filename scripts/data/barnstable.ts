import type { BeachSeed } from "./types";

const beaches: BeachSeed[] = [
  {
    searchQuery: "Sandy Neck Beach Barnstable MA",
    town: "Barnstable",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "dunes",
    bestFor: ["walking", "nature", "off-road", "dogs"],
    accessType: "sticker_required",
    parkingInfo: "ORV permits available, gatehouse parking $20/day",
    description:
      "Six miles of pristine barrier beach with towering dunes and protected wildlife habitat. One of the only Cape beaches where you can drive on the sand with an ORV permit. A nature lover's paradise.",
  },
  {
    searchQuery: "Millway Beach Barnstable MA",
    town: "Barnstable",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "harbor",
    bestFor: ["families", "harbor views", "fishing"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, moderate lot",
    description:
      "A bay-side beach in Barnstable Village near the harbor. Watch fishing boats and whale-watching tours come and go. Calm water with a view of Sandy Neck across the harbor.",
  },
];

export default beaches;
