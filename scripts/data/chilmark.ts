import type { BeachSeed } from "./types";

const beaches: BeachSeed[] = [
  {
    searchQuery: "Menemsha Beach Chilmark Martha's Vineyard MA",
    town: "Chilmark",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "harbor",
    bestFor: ["sunset", "fishing village", "lobster rolls"],
    accessType: "public",
    parkingInfo: "Very limited, bike or shuttle recommended",
    description:
      "A working fishing village with the most photographed sunset on Martha's Vineyard. Watch the fishing boats come in, grab a lobster roll from Larsen's, and settle in for the show. Arrive early — parking is brutal.",
  },
  {
    searchQuery: "Lucy Vincent Beach Chilmark Martha's Vineyard MA",
    town: "Chilmark",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "ocean_surf",
    bestFor: ["scenery", "cliffs", "seclusion"],
    accessType: "residents_only",
    parkingInfo: "Chilmark residents and renters only — strictly enforced",
    description:
      "Dramatic clay cliffs, pristine sand, and powerful surf. Widely considered one of the most beautiful beaches in New England, but access is limited to Chilmark residents and renters. The south section is clothing-optional.",
  },
  {
    searchQuery: "Squibnocket Beach Chilmark Martha's Vineyard MA",
    town: "Chilmark",
    region: "marthas_vineyard",
    island: "marthas_vineyard",
    beachType: "ocean_surf",
    bestFor: ["surfing", "scenery", "seclusion"],
    accessType: "residents_only",
    parkingInfo: "Chilmark residents only",
    description:
      "The Vineyard's best surf break, backed by stunning scenery. Resident-only access keeps it uncrowded. The rocky shoreline and big waves make this a surfer's paradise — not a gentle swim spot.",
  },
];

export default beaches;
