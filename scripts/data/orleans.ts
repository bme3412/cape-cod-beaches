import type { BeachSeed } from "./types";

const beaches: BeachSeed[] = [
  {
    searchQuery: "Nauset Beach Orleans MA",
    town: "Orleans",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "ocean_surf",
    bestFor: ["surfing", "bodyboarding", "long walks"],
    accessType: "sticker_required",
    parkingInfo: "Daily parking $25, large lot that fills by 10am in summer",
    description:
      "Ten miles of wild Atlantic barrier beach — one of the Cape's most iconic stretches of sand. Serious surf, strong currents, and a raw ocean energy that makes you feel small. Consistently ranked among America's best beaches.",
  },
  {
    searchQuery: "Skaket Beach Orleans MA",
    town: "Orleans",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["families", "tidal flats", "sunset"],
    accessType: "sticker_required",
    parkingInfo: "Sticker required, daily parking $25",
    description:
      "The bay-side gem of Orleans. Massive tidal flats at low tide create warm, ankle-deep pools — like a natural water park for little kids. Sunsets here regularly stop traffic on Route 6A.",
  },
  {
    searchQuery: "Rock Harbor Beach Orleans MA",
    town: "Orleans",
    region: "mid_cape",
    island: "cape_cod",
    beachType: "bay_calm",
    bestFor: ["sunset", "fishing", "harbor views"],
    accessType: "public",
    parkingInfo: "Limited parking near the harbor",
    description:
      "More of a harbor landing than a traditional beach, but the sunset from Rock Harbor is legendary. Watch charter fishing boats return with the day's catch as the sky turns gold over Cape Cod Bay.",
  },
];

export default beaches;
