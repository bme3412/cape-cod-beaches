// ============================================================
// Beach seed data type — all new fields are optional so
// existing town files don't need updating until you're ready
// ============================================================

export interface BeachSeed {
  // === CORE (required) ===
  searchQuery: string;
  town: string;
  region: "upper_cape" | "mid_cape" | "lower_cape" | "outer_cape" | "nantucket" | "marthas_vineyard";
  island: "cape_cod" | "marthas_vineyard" | "nantucket";
  beachType: "ocean_surf" | "bay_calm" | "sound" | "dunes" | "national_seashore" | "harbor";
  bestFor: string[];
  accessType: string;
  parkingInfo?: string;
  description?: string;

  // === LOCATION & NAVIGATION (optional) ===
  latitude?: number;
  longitude?: number;
  address?: string;
  googleMapsUrl?: string;

  // === WATER & CONDITIONS (optional) ===
  waterBody?: string;               // e.g. "Nantucket Sound"
  avgSummerWaterTempF?: string;     // range string e.g. "68–72"
  waveIntensity?: "calm" | "moderate" | "surf";
  tidalVariation?: "low" | "moderate" | "high";
  sharkRisk?: "low" | "moderate" | "elevated";
  jellyfishRisk?: string;           // seasonal notes

  // === FACILITIES & AMENITIES (optional) ===
  lifeguards?: {
    available: boolean;
    season: string;                 // e.g. "Late June – Labor Day"
    hours: string;                  // e.g. "9am–5pm"
  };
  restrooms?: boolean;
  showers?: boolean;
  changingRooms?: boolean;
  foodNearby?: string;
  wheelchairAccessible?: boolean;
  bikeRack?: boolean;
  volleyballCourt?: boolean;

  // === DOG POLICY (optional) ===
  dogPolicy?: {
    allowed: boolean;
    details: string;
  };

  // === PARKING & ACCESS DETAILS (optional) ===
  dailyParkingFee?: number | null;
  residentStickerCost?: number;
  nonResidentSeasonalCost?: number | null;
  parkingCapacity?: "small" | "medium" | "large";
  parkingEnforcement?: string;

  // === PRACTICAL PLANNING (optional) ===
  crowdLevel?: "low" | "moderate" | "high";
  bestArrivalTime?: string;
  beachLengthMiles?: number;
  sandType?: string;
  shadeAvailable?: string;
  sunsetView?: boolean;

  // === CONTACT & OFFICIAL INFO (optional) ===
  townBeachUrl?: string;
  phone?: string;
}
