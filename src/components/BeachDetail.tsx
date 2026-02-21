'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { BeachWithData } from '@/types/beach'
import {
  cacheAge,
  cacheAgeLabel,
  BEACH_TYPE_LABELS,
  BEACH_TYPE_COLORS,
  BEST_FOR_LABELS,
  BEST_FOR_ICONS,
  KNOWN_BEST_FOR,
  renderStars,
} from '@/lib/utils'

interface Props {
  beach: BeachWithData
}

// ── Shared primitives ─────────────────────────────────────────

function CacheBadge({ cachedAt }: { cachedAt: string }) {
  const age = cacheAge(cachedAt)
  const label = cacheAgeLabel(cachedAt)
  const styles = { fresh: 'bg-emerald-50 text-emerald-700 border-emerald-200', aging: 'bg-amber-50 text-amber-700 border-amber-200', stale: 'bg-red-50 text-red-700 border-red-200' }
  const dots = { fresh: 'bg-emerald-500', aging: 'bg-amber-500', stale: 'bg-red-500' }
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full border ${styles[age]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[age]}`} />
      Photo cached {label}
    </span>
  )
}

function StarRow({ rating, count }: { rating: number | null; count: number | null }) {
  if (rating === null) return null
  const { full, half, empty } = renderStars(rating)
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-0.5">
        {Array.from({ length: full }).map((_, i) => (
          <svg key={`f${i}`} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {half && (
          <svg className="w-5 h-5 text-amber-400" viewBox="0 0 20 20">
            <defs><linearGradient id="half-lg"><stop offset="50%" stopColor="currentColor" /><stop offset="50%" stopColor="#e7e5e4" /></linearGradient></defs>
            <path fill="url(#half-lg)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <svg key={`e${i}`} className="w-5 h-5 text-stone-300 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </span>
      <span className="text-stone-700 font-semibold">{rating.toFixed(1)}</span>
      {count && <span className="text-stone-400 text-sm font-mono">({count.toLocaleString()} reviews)</span>}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-100">
      <p className="text-[10px] font-mono font-semibold text-stone-400 uppercase tracking-wider">{children}</p>
    </div>
  )
}

function Row({ icon, label, value }: { icon: string; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b border-stone-100 last:border-0">
      <span className="text-sm w-5 text-center flex-shrink-0 mt-0.5 leading-none">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-0.5">{label}</p>
        <div className="text-sm text-stone-700 leading-snug">{value}</div>
      </div>
    </div>
  )
}

// ── Field-specific display components ────────────────────────

function AccessBadge({ accessType }: { accessType: string }) {
  const map: Record<string, { label: string; style: string; dot: string }> = {
    public:                  { label: 'Free & Open to All',     style: 'bg-green-50 text-green-700 border-green-200',  dot: '🟢' },
    sticker_required:        { label: 'Sticker / Day Fee',       style: 'bg-amber-50 text-amber-700 border-amber-200',  dot: '🟡' },
    resident_only:           { label: 'Residents Only',          style: 'bg-red-50 text-red-600 border-red-200',        dot: '🔴' },
    residents_only:          { label: 'Residents Only',          style: 'bg-red-50 text-red-600 border-red-200',        dot: '🔴' },
    national_seashore_pass:  { label: 'National Seashore Pass',  style: 'bg-blue-50 text-blue-700 border-blue-200',     dot: '🔵' },
  }
  const key = accessType.toLowerCase()
  const info = map[key] ?? { label: accessType, style: 'bg-stone-50 text-stone-600 border-stone-200', dot: '⚪' }
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-mono font-medium px-3 py-1.5 rounded-full border ${info.style}`}>
      {info.dot} {info.label}
    </span>
  )
}

function WaveBar({ intensity }: { intensity: string }) {
  const map = { calm: { label: 'Calm water', color: 'text-teal-600', bars: 1 }, moderate: { label: 'Moderate chop', color: 'text-amber-600', bars: 2 }, surf: { label: 'Surf / strong', color: 'text-blue-700', bars: 3 } }
  const info = map[intensity as keyof typeof map] ?? { label: intensity, color: 'text-stone-600', bars: 0 }
  return (
    <span className={`inline-flex items-center gap-2 font-medium ${info.color}`}>
      <span className="flex items-end gap-0.5">
        {[1, 2, 3].map((n) => (
          <span key={n} className={`inline-block w-1.5 rounded-full transition-all ${n <= info.bars ? 'bg-current' : 'bg-current opacity-20'}`} style={{ height: n <= info.bars ? `${8 + n * 4}px` : '8px' }} />
        ))}
      </span>
      {info.label}
    </span>
  )
}

function TideBadge({ variation }: { variation: string }) {
  const map = { low: 'Low variance', moderate: 'Moderate tides', high: 'High variance' }
  return <span className="text-sm text-stone-600">{map[variation as keyof typeof map] ?? variation}</span>
}

function RiskBadge({ level, type }: { level: string; type: 'shark' | 'jellyfish' }) {
  const colorMap: Record<string, string> = { low: 'text-emerald-600', moderate: 'text-amber-600', elevated: 'text-red-600' }
  const color = colorMap[level.toLowerCase()] ?? 'text-stone-600'
  if (type === 'jellyfish') return <span className="text-sm text-stone-600">{level}</span>
  const sharkLabel: Record<string, string> = { low: 'Low risk', moderate: 'Moderate risk', elevated: 'Elevated risk' }
  return <span className={`text-sm font-medium ${color}`}>{sharkLabel[level.toLowerCase()] ?? level}</span>
}

function FacilityDots({ beach }: { beach: BeachWithData }) {
  const items = [
    { key: 'lifeguards', icon: '🏊', label: 'Lifeguards', val: beach.lifeguards },
    { key: 'restrooms', icon: '🚻', label: 'Restrooms', val: beach.restrooms },
    { key: 'showers', icon: '🚿', label: 'Showers', val: beach.showers },
    { key: 'changing_rooms', icon: '🔄', label: 'Changing rooms', val: beach.changing_rooms },
    { key: 'wheelchair_accessible', icon: '♿', label: 'Wheelchair access', val: beach.wheelchair_accessible },
    { key: 'bike_rack', icon: '🚲', label: 'Bike rack', val: beach.bike_rack },
    { key: 'volleyball_court', icon: '🏐', label: 'Volleyball', val: beach.volleyball_court },
  ]
  const known = items.filter((i) => i.val !== undefined)
  if (known.length === 0) return <span className="text-stone-400 text-sm">—</span>
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
      {known.map((i) => (
        <span key={i.key} className={`inline-flex items-center gap-1 text-sm ${i.val ? 'text-stone-700' : 'text-stone-400 line-through decoration-stone-300'}`}>
          <span className={i.val ? '' : 'opacity-40'}>{i.icon}</span>
          {i.label}
        </span>
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────

export default function BeachDetail({ beach }: Props) {
  const sortedPhotos = [...beach.photos].sort((a, b) => a.photo_index - b.photo_index)
  const [activeIdx, setActiveIdx] = useState(0)
  const activePhoto = sortedPhotos[activeIdx]

  const typeBadge = BEACH_TYPE_COLORS[beach.beach_type]
  const typeLabel = BEACH_TYPE_LABELS[beach.beach_type]
  const knownTags = beach.best_for.filter((t) => KNOWN_BEST_FOR.has(t as never))

  // Section visibility guards
  const hasConditions = !!(beach.water_body || beach.avg_water_temp_f || beach.wave_intensity || beach.tidal_variation || beach.shark_risk || beach.jellyfish_risk)
  const hasFacilities = beach.lifeguards !== undefined || beach.restrooms !== undefined || beach.showers !== undefined || beach.changing_rooms !== undefined || beach.wheelchair_accessible !== undefined || beach.bike_rack !== undefined || beach.volleyball_court !== undefined
  const hasParking = !!(beach.access_type || beach.daily_parking_fee !== undefined || beach.resident_sticker_cost || beach.non_resident_seasonal_cost !== undefined || beach.parking_capacity || beach.parking_enforcement || beach.parking_info)
  const hasDogs = beach.dog_policy_allowed !== undefined
  const hasPlanning = !!(beach.crowd_level || beach.best_arrival_time || beach.beach_length_miles || beach.sand_type || beach.shade_available)

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-mono text-stone-500 hover:text-ocean transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All Beaches
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        {/* ── Hero photo ── */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-stone-200 mb-4">
          {activePhoto ? (
            <Image src={activePhoto.storage_url} alt={`${beach.name} — photo ${activeIdx + 1}`} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" priority />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {sortedPhotos.length > 1 && (
            <>
              <button onClick={() => setActiveIdx((i) => (i - 1 + sortedPhotos.length) % sortedPhotos.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors" aria-label="Previous photo">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={() => setActiveIdx((i) => (i + 1) % sortedPhotos.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors" aria-label="Next photo">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
              <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs font-mono px-2 py-1 rounded-full">
                {activeIdx + 1} / {sortedPhotos.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {sortedPhotos.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
            {sortedPhotos.map((photo, i) => (
              <button key={photo.id} onClick={() => setActiveIdx(i)} aria-label={`View photo ${i + 1}`}
                className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === activeIdx ? 'border-ocean' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <Image src={photo.storage_url} alt={`Thumb ${i + 1}`} fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* ── Main layout ── */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Left — headline + description + best-for */}
          <div className="md:col-span-2">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-xs font-mono font-medium px-2.5 py-1 rounded-full ${typeBadge}`}>{typeLabel}</span>
              {beach.access_type && <AccessBadge accessType={beach.access_type} />}
              {activePhoto && <CacheBadge cachedAt={activePhoto.cached_at} />}
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-800 mb-1">{beach.name}</h1>
            <p className="font-mono text-stone-500 text-sm uppercase tracking-widest mb-4">
              {beach.town}, Massachusetts{beach.water_body ? ` · ${beach.water_body}` : ''}
            </p>

            <StarRow rating={beach.rating?.rating ?? null} count={beach.rating?.rating_count ?? null} />

            <p className="mt-5 text-stone-600 leading-relaxed text-[15px]">{beach.description}</p>

            {/* Best For */}
            {knownTags.length > 0 && (
              <div className="mt-6">
                <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-2">Best For</p>
                <div className="flex flex-wrap gap-1.5">
                  {knownTags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 bg-stone-100 text-stone-700 rounded-full">
                      <span>{BEST_FOR_ICONS[tag as keyof typeof BEST_FOR_ICONS]}</span>
                      {BEST_FOR_LABELS[tag as keyof typeof BEST_FOR_LABELS]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick-tip arrival time */}
            {beach.best_arrival_time && (
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <p className="text-[10px] font-mono text-amber-600 uppercase tracking-wider mb-1">💡 Best Arrival</p>
                <p className="text-sm text-amber-800">{beach.best_arrival_time}</p>
              </div>
            )}

            {activePhoto?.attribution && (
              <p className="mt-5 text-xs font-mono text-stone-400">Photo by {activePhoto.attribution} via Google Places</p>
            )}
          </div>

          {/* Right — detail cards */}
          <div className="space-y-3">

            {/* ── Water & Conditions ── */}
            {hasConditions && (
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <SectionTitle>Water &amp; Conditions</SectionTitle>
                {beach.wave_intensity && (
                  <Row icon="〰️" label="Wave Intensity" value={<WaveBar intensity={beach.wave_intensity} />} />
                )}
                {beach.avg_water_temp_f && (
                  <Row icon="🌡️" label="Summer Water Temp" value={`${beach.avg_water_temp_f}°F`} />
                )}
                {beach.tidal_variation && (
                  <Row icon="🌊" label="Tidal Range" value={<TideBadge variation={beach.tidal_variation} />} />
                )}
                {beach.shark_risk && (
                  <Row icon="🦈" label="Shark Risk" value={<RiskBadge level={beach.shark_risk} type="shark" />} />
                )}
                {beach.jellyfish_risk && (
                  <Row icon="🪼" label="Jellyfish" value={<RiskBadge level={beach.jellyfish_risk} type="jellyfish" />} />
                )}
              </div>
            )}

            {/* ── Facilities ── */}
            {hasFacilities && (
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <SectionTitle>Facilities</SectionTitle>
                <div className="px-4 py-3">
                  <FacilityDots beach={beach} />
                </div>
                {beach.lifeguards && beach.lifeguard_season && (
                  <Row icon="🏊" label="Lifeguard Hours" value={`${beach.lifeguard_season}${beach.lifeguard_hours ? `, ${beach.lifeguard_hours}` : ''}`} />
                )}
                {beach.food_nearby && (
                  <Row icon="🍦" label="Food Nearby" value={beach.food_nearby} />
                )}
                {beach.shade_available && (
                  <Row icon="☂️" label="Shade" value={beach.shade_available} />
                )}
                {beach.sand_type && (
                  <Row icon="🏖️" label="Sand" value={beach.sand_type} />
                )}
              </div>
            )}

            {/* ── Dogs ── */}
            {hasDogs && (
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <SectionTitle>Dog Policy</SectionTitle>
                <Row
                  icon="🐕"
                  label={beach.dog_policy_allowed ? 'Dogs Allowed' : 'Dogs Restricted'}
                  value={
                    <span className={beach.dog_policy_allowed ? 'text-green-700' : 'text-amber-700'}>
                      {beach.dog_policy_allowed ? '✓ Dogs welcome' : '⚠ Seasonal restrictions'}
                      {beach.dog_policy_details && (
                        <span className="block text-xs text-stone-500 mt-0.5">{beach.dog_policy_details}</span>
                      )}
                    </span>
                  }
                />
              </div>
            )}

            {/* ── Parking & Access ── */}
            {hasParking && (
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <SectionTitle>Parking &amp; Access</SectionTitle>
                {beach.access_type && (
                  <Row icon="🅿️" label="Access Type" value={<AccessBadge accessType={beach.access_type} />} />
                )}
                {beach.daily_parking_fee !== undefined && beach.daily_parking_fee !== null && (
                  <Row icon="💵" label="Daily Fee" value={`$${beach.daily_parking_fee}`} />
                )}
                {beach.resident_sticker_cost !== undefined && (
                  <Row icon="📋" label="Resident Sticker" value={`$${beach.resident_sticker_cost}/season`} />
                )}
                {beach.non_resident_seasonal_cost !== undefined && beach.non_resident_seasonal_cost !== null && (
                  <Row icon="📋" label="Non-Resident Pass" value={`$${beach.non_resident_seasonal_cost}/season`} />
                )}
                {beach.parking_capacity && (
                  <Row icon="🚗" label="Lot Size" value={{ small: 'Small lot', medium: 'Medium lot', large: 'Large lot' }[beach.parking_capacity]} />
                )}
                {beach.parking_enforcement && (
                  <Row icon="⏰" label="Enforcement" value={beach.parking_enforcement} />
                )}
                {beach.parking_info && (
                  <Row icon="ℹ️" label="Notes" value={beach.parking_info} />
                )}
              </div>
            )}

            {/* ── Planning ── */}
            {hasPlanning && (
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <SectionTitle>Planning</SectionTitle>
                {beach.crowd_level && (
                  <Row icon="👥" label="Crowd Level" value={
                    <span className={{ low: 'text-green-700', moderate: 'text-amber-600', high: 'text-red-600' }[beach.crowd_level] ?? ''}>
                      {{ low: '● Low — rarely packed', moderate: '● Moderate — busy weekends', high: '● High — arrive early' }[beach.crowd_level]}
                    </span>
                  } />
                )}
                {beach.beach_length_miles && (
                  <Row icon="📏" label="Beach Length" value={`~${beach.beach_length_miles} mile${beach.beach_length_miles !== 1 ? 's' : ''}`} />
                )}
                {beach.sunset_view && (
                  <Row icon="🌅" label="Sunset View" value={<span className="text-orange-600 font-medium">Great sunset spot</span>} />
                )}
              </div>
            )}

            {/* ── Location & Contact ── */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <SectionTitle>Location &amp; Contact</SectionTitle>
              <Row icon="📍" label="Directions" value={
                <a href={`https://maps.google.com/?q=${beach.lat},${beach.lng}`} target="_blank" rel="noopener noreferrer"
                  className="text-ocean hover:underline font-mono">Open in Google Maps</a>
              } />
              {beach.phone && (
                <Row icon="📞" label="Phone" value={
                  <a href={`tel:${beach.phone}`} className="text-ocean hover:underline font-mono">{beach.phone}</a>
                } />
              )}
              {beach.town_beach_url && (
                <Row icon="🔗" label="Official Page" value={
                  <a href={beach.town_beach_url} target="_blank" rel="noopener noreferrer" className="text-ocean hover:underline font-mono text-xs break-all">Town website</a>
                } />
              )}
              {beach.rating?.refreshed_at && (
                <Row icon="⭐" label="Ratings Updated" value={<span className="font-mono text-stone-500">{cacheAgeLabel(beach.rating.refreshed_at)}</span>} />
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
