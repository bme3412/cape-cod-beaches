export type BeachType = 'ocean' | 'bay' | 'dunes' | 'national_seashore' | 'harbor'

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
  id: string // place_id
  name: string
  town: string
  lat: number
  lng: number
  beach_type: BeachType
  best_for: BestFor[]
  description: string
  is_active: boolean
  created_at?: string
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
