/**
 * Google Places API (New) helpers.
 * ONLY used by seed scripts and cron jobs — never in user-facing routes.
 */

const PLACES_BASE = 'https://places.googleapis.com/v1'
const API_KEY = process.env.GOOGLE_MAPS_API_KEY!

export interface PlaceDetails {
  id: string
  displayName: { text: string }
  formattedAddress: string
  location: { latitude: number; longitude: number }
  rating?: number
  userRatingCount?: number
  photos?: PlacePhoto[]
}

export interface PlacePhoto {
  name: string // e.g. "places/ChIJ.../photos/AUacShh..."
  widthPx: number
  heightPx: number
  authorAttributions: { displayName: string; uri: string; photoUri: string }[]
}

export interface TextSearchResult {
  places: PlaceDetails[]
}

/** Search for a place by name and location hint */
export async function textSearchPlace(query: string): Promise<PlaceDetails | null> {
  const res = await fetch(`${PLACES_BASE}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount',
    },
    body: JSON.stringify({
      textQuery: query,
      locationBias: {
        circle: {
          center: { latitude: 41.7, longitude: -70.3 },
          radius: 80000,
        },
      },
      maxResultCount: 1,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Places text search failed: ${err}`)
  }

  const data: TextSearchResult = await res.json()
  return data.places?.[0] ?? null
}

/** Fetch full place details including fresh photo tokens */
export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  const res = await fetch(`${PLACES_BASE}/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask':
        'id,displayName,location,rating,userRatingCount,photos',
    },
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Place details fetch failed for ${placeId}: ${err}`)
  }

  return res.json()
}

/** Fetch photo bytes from a photo resource name and return as ArrayBuffer */
export async function fetchPhotoBytes(
  photoName: string,
  maxWidthPx = 1600
): Promise<ArrayBuffer> {
  const url = `${PLACES_BASE}/${photoName}/media?maxWidthPx=${maxWidthPx}&key=${API_KEY}&skipHttpRedirect=true`
  const res = await fetch(url)

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Photo fetch failed for ${photoName}: ${err}`)
  }

  // The API returns a JSON redirect object when skipHttpRedirect=true
  const json = await res.json()
  const photoUri: string = json.photoUri

  const imgRes = await fetch(photoUri)
  if (!imgRes.ok) throw new Error(`Photo download failed: ${imgRes.status}`)
  return imgRes.arrayBuffer()
}

/** Get only ratings (cheap metadata call) */
export async function getPlaceRating(
  placeId: string
): Promise<{ rating: number | null; userRatingCount: number | null }> {
  const res = await fetch(`${PLACES_BASE}/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'rating,userRatingCount',
    },
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Rating fetch failed for ${placeId}: ${err}`)
  }

  const data = await res.json()
  return {
    rating: data.rating ?? null,
    userRatingCount: data.userRatingCount ?? null,
  }
}
