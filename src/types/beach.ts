export type BeachType = 'ocean_surf' | 'bay_calm' | 'dunes' | 'national_seashore' | 'harbor' | 'sound'

export type BestFor =
  | 'swimming'
  | 'surfing'
  | 'families'
  | 'sunsets'
  | 'sunrises'
  | 'hiking'
  | 'birding'
  | 'fishing'
  | 'windsurfing'
  | 'kayaking'
  | 'dogs'
  | 'seclusion'
  | 'snorkeling'

export interface Beach {
  id: string
  name: string
  town: string
  lat: number
  lng: number
  beach_type: BeachType
  best_for: BestFor[]
  description: string
  is_active: boolean
  created_at?: string

  // Expanded fields — nullable, populated as data is enriched
  region?: string
  island?: string
  access_type?: string
  parking_info?: string

  // Water & conditions
  water_body?: string
  avg_water_temp_f?: string
  wave_intensity?: 'calm' | 'moderate' | 'surf'
  tidal_variation?: 'low' | 'moderate' | 'high'
  shark_risk?: 'low' | 'moderate' | 'elevated'
  jellyfish_risk?: string

  // Facilities
  lifeguards?: boolean
  lifeguard_season?: string
  lifeguard_hours?: string
  restrooms?: boolean
  showers?: boolean
  changing_rooms?: boolean
  bike_rack?: boolean
  volleyball_court?: boolean
  food_nearby?: string
  wheelchair_accessible?: boolean

  // Dog policy
  dog_policy_allowed?: boolean
  dog_policy_details?: string

  // Parking details
  resident_sticker_cost?: number
  non_resident_seasonal_cost?: number | null
  parking_capacity?: 'small' | 'medium' | 'large'
  parking_enforcement?: string

  // Planning
  crowd_level?: 'low' | 'moderate' | 'high'
  daily_parking_fee?: number | null
  beach_length_miles?: number | null
  sunset_view?: boolean
  best_arrival_time?: string
  sand_type?: string
  shade_available?: string

  // Contact & official info
  town_beach_url?: string
  phone?: string
}

export interface BeachPhoto {
  id: number
  beach_id: string
  photo_index: number
  storage_url: string
  attribution: string | null
  cached_at: string
  expires_at: string
}

export interface BeachRating {
  id: number
  beach_id: string
  rating: number | null
  rating_count: number | null
  refreshed_at: string
}

export interface BeachWithData extends Beach {
  photos: BeachPhoto[]
  rating: BeachRating | null
}

export type FilterType = 'all' | BeachType
