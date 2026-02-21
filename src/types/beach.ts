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
  shark_risk?: 'low' | 'moderate' | 'elevated'

  // Facilities
  lifeguards?: boolean
  lifeguard_season?: string
  lifeguard_hours?: string
  restrooms?: boolean
  showers?: boolean
  food_nearby?: string
  wheelchair_accessible?: boolean

  // Dog policy
  dog_policy_allowed?: boolean
  dog_policy_details?: string

  // Planning
  crowd_level?: 'low' | 'moderate' | 'high'
  daily_parking_fee?: number | null
  beach_length_miles?: number | null
  sunset_view?: boolean
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
