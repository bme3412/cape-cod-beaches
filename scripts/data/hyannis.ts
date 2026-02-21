import type { BeachSeed } from "./types";

const beaches: BeachSeed[] = [
  {
    searchQuery: "Kalmus Beach Hyannis MA",
    town: "Hyannis",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["windsurfing", "families"],
    accessType: "public",
    parkingInfo: "Public parking lot, fills early in summer",
    description:
      "The windsurfing capital of Cape Cod. Consistent onshore breezes off Nantucket Sound make this the go-to for kiteboarding and windsurfing. The calm inner harbor side is perfect for families.",
  },
  {
    searchQuery: "Veterans Park Beach Hyannis MA",
    town: "Hyannis",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "playground", "picnics"],
    accessType: "public",
    parkingInfo: "Free public parking",
    description:
      "Hyannis's most accessible beach — free parking, a playground, picnic areas, and a bathhouse. Calm water and full amenities make it the go-to for families who don't want to deal with sticker hassles.",
  },
  {
    searchQuery: "Keyes Beach Sea Street Beach Hyannis MA",
    town: "Hyannis",
    region: "upper_cape",
    island: "cape_cod",
    beachType: "sound",
    bestFor: ["families", "town access", "swimming"],
    accessType: "public",
    parkingInfo: "Daily parking available",
    description:
      "Also known as Sea Street Beach, this is a popular Hyannis beach on Nantucket Sound. Short walk from downtown shops and restaurants. Lifeguards, restrooms, and a solid family beach experience.",
  },
];

export default beaches;
