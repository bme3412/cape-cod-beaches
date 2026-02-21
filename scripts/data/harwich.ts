import type { BeachSeed } from "./types";

const beaches: BeachSeed[] = [
  {
    searchQuery: "Red River Beach Harwich MA",
    town: "Harwich",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "warm water", "swimming"],
    accessType: "sticker_required",
    parkingInfo: "Sticker or daily fee, decent-sized lot",
    description:
      "Harwich's top beach on Nantucket Sound. Consistently warm water, a long sandy stretch, and a neighborhood feel. Less flashy than some Cape beaches, which is exactly the point.",
  },
  {
    searchQuery: "Bank Street Beach Harwich MA",
    town: "Harwich",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "paddleboarding", "kayaking"],
    accessType: "sticker_required",
    parkingInfo: "Sticker or daily fee",
    description:
      "A Nantucket Sound beach close to shopping and amenities in Harwich Port. Ideal for paddleboarding, swimming, and kayaking. Slightly warmer water than the Atlantic-facing beaches.",
  },
  {
    searchQuery: "Pleasant Road Beach Harwich MA",
    town: "Harwich",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "swimming"],
    accessType: "sticker_required",
    parkingInfo: "Sticker or daily fee",
    description:
      "A well-maintained Nantucket Sound beach in Harwich Port. Warm water, good facilities, and easy access from Route 28. A reliable family beach option.",
  },
  {
    searchQuery: "Earle Road Beach Harwich MA",
    town: "Harwich",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "quiet"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, small lot",
    description:
      "A smaller, quieter Harwich beach on Nantucket Sound. Less parking means fewer people — a good option for families who want warm water without the crowds of Red River.",
  },
];

export default beaches;
