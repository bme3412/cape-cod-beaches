import type { BeachType, BestFor } from '@/types/beach'

export function cacheAge(cachedAt: string): 'fresh' | 'aging' | 'stale' {
  const days = (Date.now() - new Date(cachedAt).getTime()) / (1000 * 60 * 60 * 24)
  if (days < 7) return 'fresh'
  if (days <= 20) return 'aging'
  return 'stale'
}

export function cacheAgeLabel(cachedAt: string): string {
  const days = Math.floor(
    (Date.now() - new Date(cachedAt).getTime()) / (1000 * 60 * 60 * 24)
  )
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

export const BEACH_TYPE_LABELS: Record<BeachType, string> = {
  ocean: 'Ocean / Surf',
  bay: 'Bay / Calm',
  dunes: 'Dunes',
  national_seashore: 'National Seashore',
  harbor: 'Harbor',
}

export const BEACH_TYPE_COLORS: Record<BeachType, string> = {
  ocean: 'bg-blue-100 text-blue-800',
  bay: 'bg-teal-100 text-teal-800',
  dunes: 'bg-amber-100 text-amber-800',
  national_seashore: 'bg-green-100 text-green-800',
  harbor: 'bg-slate-100 text-slate-700',
}

export const BEST_FOR_LABELS: Record<BestFor, string> = {
  swimming: 'Swimming',
  surfing: 'Surfing',
  families: 'Families',
  sunsets: 'Sunsets',
  sunrises: 'Sunrises',
  hiking: 'Hiking',
  birding: 'Birding',
  fishing: 'Fishing',
  windsurfing: 'Windsurfing',
  kayaking: 'Kayaking',
  dogs: 'Dogs Welcome',
  seclusion: 'Seclusion',
  snorkeling: 'Snorkeling',
}

export function formatRating(rating: number | null): string {
  if (rating === null) return '—'
  return rating.toFixed(1)
}

export function renderStars(rating: number | null): { full: number; half: boolean; empty: number } {
  if (rating === null) return { full: 0, half: false, empty: 5 }
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return { full, half, empty }
}
