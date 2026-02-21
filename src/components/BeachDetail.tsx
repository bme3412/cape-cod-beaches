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

function CacheBadge({ cachedAt }: { cachedAt: string }) {
  const age = cacheAge(cachedAt)
  const label = cacheAgeLabel(cachedAt)
  const s = { fresh: 'bg-emerald-50 text-emerald-700 border-emerald-200', aging: 'bg-amber-50 text-amber-700 border-amber-200', stale: 'bg-red-50 text-red-700 border-red-200' }
  const d = { fresh: 'bg-emerald-500', aging: 'bg-amber-500', stale: 'bg-red-500' }
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full border ${s[age]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${d[age]}`} />Photo cached {label}
    </span>
  )
}

function StarRow({ rating, count }: { rating: number | null; count: number | null }) {
  if (!rating) return null
  const { full, half, empty } = renderStars(rating)
  const StarPath = () => <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-0.5">
        {Array.from({ length: full }).map((_, i) => <svg key={`f${i}`} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20"><StarPath /></svg>)}
        {half && (
          <svg className="w-5 h-5 text-amber-400" viewBox="0 0 20 20">
            <defs><linearGradient id="half-lg"><stop offset="50%" stopColor="currentColor" /><stop offset="50%" stopColor="#e7e5e4" /></linearGradient></defs>
            <path fill="url(#half-lg)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        {Array.from({ length: empty }).map((_, i) => <svg key={`e${i}`} className="w-5 h-5 text-stone-300 fill-current" viewBox="0 0 20 20"><StarPath /></svg>)}
      </span>
      <span className="text-stone-700 font-semibold">{rating.toFixed(1)}</span>
      {count && <span className="text-stone-400 text-sm font-mono">({count.toLocaleString()} reviews)</span>}
    </div>
  )
}

function AccessBadge({ accessType }: { accessType: string }) {
  const map: Record<string, { label: string; style: string; dot: string }> = {
    public:                 { label: 'Free & Open',           style: 'bg-green-50 text-green-700 border-green-200', dot: '🟢' },
    sticker_required:       { label: 'Sticker / Day Fee',     style: 'bg-amber-50 text-amber-700 border-amber-200', dot: '🟡' },
    resident_only:          { label: 'Residents Only',         style: 'bg-red-50 text-red-600 border-red-200',       dot: '🔴' },
    residents_only:         { label: 'Residents Only',         style: 'bg-red-50 text-red-600 border-red-200',       dot: '🔴' },
    national_seashore_pass: { label: 'Park Pass Required',    style: 'bg-blue-50 text-blue-700 border-blue-200',    dot: '🔵' },
  }
  const info = map[accessType.toLowerCase()] ?? { label: accessType, style: 'bg-stone-100 text-stone-600 border-stone-200', dot: '⚪' }
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-1 rounded-full border ${info.style}`}>
      {info.dot} {info.label}
    </span>
  )
}

// Thin divider between card sections
function Divider() {
  return <div className="h-px bg-stone-100 mx-4" />
}

export default function BeachDetail({ beach }: Props) {
  const sortedPhotos = [...beach.photos].sort((a, b) => a.photo_index - b.photo_index)
  const [activeIdx, setActiveIdx] = useState(0)
  const activePhoto = sortedPhotos[activeIdx]

  const knownTags = beach.best_for.filter((t) => KNOWN_BEST_FOR.has(t as never))

  // Only show facilities that are CONFIRMED present (=== true)
  const beachAny = beach as unknown as Record<string, unknown>
  const confirmedFacilities = [
    { key: 'lifeguards',           icon: '🏊', label: 'Lifeguards' },
    { key: 'restrooms',            icon: '🚻', label: 'Restrooms' },
    { key: 'showers',              icon: '🚿', label: 'Showers' },
    { key: 'changing_rooms',       icon: '🔄', label: 'Changing rooms' },
    { key: 'wheelchair_accessible',icon: '♿',  label: 'Accessible' },
    { key: 'bike_rack',            icon: '🚲', label: 'Bike rack' },
    { key: 'volleyball_court',     icon: '🏐', label: 'Volleyball' },
  ].filter((f) => beachAny[f.key] === true)

  // Conditions
  const waveMap = { calm: { label: 'Calm water', color: 'text-teal-600', bars: 1 }, moderate: { label: 'Moderate', color: 'text-amber-600', bars: 2 }, surf: { label: 'Surf / Strong', color: 'text-blue-700', bars: 3 } }
  const waveInfo = beach.wave_intensity ? waveMap[beach.wave_intensity] : null
  const sharkColors: Record<string, string> = { low: 'text-emerald-600', moderate: 'text-amber-600', elevated: 'text-red-600' }
  const crowdInfo: Record<string, { label: string; color: string }> = { low: { label: 'Low — rarely packed', color: 'text-emerald-600' }, moderate: { label: 'Moderate — busy weekends', color: 'text-amber-600' }, high: { label: 'High — arrive early', color: 'text-red-600' } }

  const hasConditions = !!(beach.water_body || beach.avg_water_temp_f || beach.wave_intensity || beach.tidal_variation || beach.shark_risk || beach.jellyfish_risk)
  const hasFacilities = confirmedFacilities.length > 0 || !!(beach.food_nearby || beach.shade_available || beach.sand_type || (beach.lifeguards && beach.lifeguard_season))
  const hasParking = !!(beach.access_type || (beach.daily_parking_fee !== undefined && beach.daily_parking_fee !== null) || (beach.resident_sticker_cost != null) || (beach.non_resident_seasonal_cost != null) || beach.parking_capacity || beach.parking_enforcement || beach.parking_info)
  const hasPlanning = !!(beach.crowd_level || beach.best_arrival_time || beach.beach_length_miles || beach.sunset_view)
  const hasDogs = beach.dog_policy_allowed !== undefined
  const hasCard = hasConditions || hasFacilities || hasParking || hasPlanning || hasDogs || !!(beach.phone || beach.town_beach_url)

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
        {/* Hero */}
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

        {/* Main 2-col layout */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Left — editorial */}
          <div className="md:col-span-2">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-xs font-mono font-medium px-2.5 py-1 rounded-full ${BEACH_TYPE_COLORS[beach.beach_type]}`}>
                {BEACH_TYPE_LABELS[beach.beach_type]}
              </span>
              {beach.access_type && <AccessBadge accessType={beach.access_type} />}
              {activePhoto && <CacheBadge cachedAt={activePhoto.cached_at} />}
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-800 mb-1">{beach.name}</h1>
            <p className="font-mono text-stone-500 text-sm uppercase tracking-widest mb-4">
              {beach.town}, Massachusetts{beach.water_body ? <> · <span className="normal-case">{beach.water_body}</span></> : ''}
            </p>

            <StarRow rating={beach.rating?.rating ?? null} count={beach.rating?.rating_count ?? null} />

            <p className="mt-5 text-stone-600 leading-relaxed text-[15px]">{beach.description}</p>

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

            {beach.best_arrival_time && (
              <div className="mt-5 flex items-start gap-2.5 bg-amber-50 border border-amber-200/70 rounded-xl px-4 py-3">
                <span className="text-base mt-0.5">💡</span>
                <div>
                  <p className="text-[10px] font-mono text-amber-600 uppercase tracking-wider mb-0.5">Best Arrival</p>
                  <p className="text-sm text-amber-900">{beach.best_arrival_time}</p>
                </div>
              </div>
            )}

            {activePhoto?.attribution && (
              <p className="mt-5 text-xs font-mono text-stone-400">Photo by {activePhoto.attribution} via Google Places</p>
            )}
          </div>

          {/* Right — single At a Glance card */}
          <div>
            {hasCard && (
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-stone-100">
                  <p className="text-xs font-mono font-semibold text-stone-500 uppercase tracking-wider">At a Glance</p>
                </div>

                {/* ── Water & Conditions ── */}
                {hasConditions && (
                  <div className="px-4 py-3 space-y-2">
                    {waveInfo && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-stone-400">Waves</span>
                        <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${waveInfo.color}`}>
                          <span className="flex items-end gap-0.5">
                            {[1, 2, 3].map((n) => (
                              <span key={n} className={`inline-block w-1.5 rounded-full ${n <= waveInfo.bars ? 'bg-current' : 'bg-current opacity-20'}`} style={{ height: n <= waveInfo.bars ? `${8 + n * 3}px` : '8px' }} />
                            ))}
                          </span>
                          {waveInfo.label}
                        </span>
                      </div>
                    )}
                    {beach.avg_water_temp_f && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-stone-400">Water temp</span>
                        <span className="text-sm text-stone-700">{beach.avg_water_temp_f}°F in summer</span>
                      </div>
                    )}
                    {beach.tidal_variation && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-stone-400">Tides</span>
                        <span className="text-sm text-stone-700">{{ low: 'Low variance', moderate: 'Moderate', high: 'High variance' }[beach.tidal_variation]}</span>
                      </div>
                    )}
                    {beach.shark_risk && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-stone-400">Shark risk</span>
                        <span className={`text-sm font-medium ${sharkColors[beach.shark_risk] ?? 'text-stone-600'}`}>
                          {{ low: '🦈 Low', moderate: '🦈 Moderate', elevated: '🦈 Elevated' }[beach.shark_risk]}
                        </span>
                      </div>
                    )}
                    {beach.jellyfish_risk && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-stone-400">Jellyfish</span>
                        <span className="text-sm text-stone-600">{beach.jellyfish_risk}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Facilities ── */}
                {hasFacilities && (
                  <>
                    {hasConditions && <Divider />}
                    <div className="px-4 py-3">
                      {confirmedFacilities.length > 0 && (
                        <div className="flex flex-wrap gap-x-3 gap-y-2 mb-2">
                          {confirmedFacilities.map((f) => (
                            <span key={f.key} className="inline-flex items-center gap-1 text-xs text-stone-600 bg-stone-50 px-2 py-1 rounded-lg border border-stone-100">
                              <span>{f.icon}</span>{f.label}
                            </span>
                          ))}
                        </div>
                      )}
                      {beach.lifeguards && beach.lifeguard_season && (
                        <p className="text-xs text-stone-500 mt-1.5">Lifeguards: {beach.lifeguard_season}{beach.lifeguard_hours ? `, ${beach.lifeguard_hours}` : ''}</p>
                      )}
                      {beach.food_nearby && (
                        <p className="text-xs text-stone-500 mt-1.5">🍦 {beach.food_nearby}</p>
                      )}
                      {beach.shade_available && (
                        <p className="text-xs text-stone-500 mt-1.5">☂️ {beach.shade_available}</p>
                      )}
                      {beach.sand_type && (
                        <p className="text-xs text-stone-500 mt-1.5">🏖️ {beach.sand_type}</p>
                      )}
                    </div>
                  </>
                )}

                {/* ── Dog policy ── */}
                {hasDogs && (
                  <>
                    <Divider />
                    <div className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <span className="text-base">🐕</span>
                        <div>
                          {beach.dog_policy_allowed
                            ? <p className="text-sm text-green-700 font-medium">Dogs welcome</p>
                            : <p className="text-sm text-amber-700 font-medium">Seasonal dog restrictions</p>
                          }
                          {beach.dog_policy_details && (
                            <p className="text-xs text-stone-500 mt-0.5">{beach.dog_policy_details}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ── Parking & Access ── */}
                {hasParking && (
                  <>
                    <Divider />
                    <div className="px-4 py-3 space-y-2">
                      {beach.access_type && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-stone-400">Access</span>
                          <AccessBadge accessType={beach.access_type} />
                        </div>
                      )}
                      {beach.daily_parking_fee != null && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-stone-400">Daily fee</span>
                          <span className="text-sm text-stone-700 font-medium">${beach.daily_parking_fee}/day</span>
                        </div>
                      )}
                      {beach.resident_sticker_cost != null && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-stone-400">Resident sticker</span>
                          <span className="text-sm text-stone-700">${beach.resident_sticker_cost}/season</span>
                        </div>
                      )}
                      {beach.non_resident_seasonal_cost != null && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-stone-400">Non-resident pass</span>
                          <span className="text-sm text-stone-700">${beach.non_resident_seasonal_cost}/season</span>
                        </div>
                      )}
                      {beach.parking_capacity && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-stone-400">Lot size</span>
                          <span className="text-sm text-stone-700">{{ small: 'Small', medium: 'Medium', large: 'Large' }[beach.parking_capacity]} lot</span>
                        </div>
                      )}
                      {beach.parking_enforcement && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-stone-400">Enforcement</span>
                          <span className="text-sm text-stone-700">{beach.parking_enforcement}</span>
                        </div>
                      )}
                      {beach.parking_info && (
                        <p className="text-xs text-stone-500">{beach.parking_info}</p>
                      )}
                    </div>
                  </>
                )}

                {/* ── Planning ── */}
                {hasPlanning && (
                  <>
                    <Divider />
                    <div className="px-4 py-3 space-y-2">
                      {beach.crowd_level && crowdInfo[beach.crowd_level] && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-stone-400">Crowds</span>
                          <span className={`text-sm font-medium ${crowdInfo[beach.crowd_level].color}`}>
                            {crowdInfo[beach.crowd_level].label}
                          </span>
                        </div>
                      )}
                      {beach.beach_length_miles && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-stone-400">Beach length</span>
                          <span className="text-sm text-stone-700">~{beach.beach_length_miles} mi</span>
                        </div>
                      )}
                      {beach.sunset_view && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-stone-400">Sunsets</span>
                          <span className="text-sm text-orange-600 font-medium">🌅 Great sunset spot</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* ── Location & Contact ── */}
                <Divider />
                <div className="px-4 py-3 space-y-2">
                  <a href={`https://maps.google.com/?q=${beach.lat},${beach.lng}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-ocean hover:underline font-mono">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Open in Google Maps
                  </a>
                  {beach.phone && (
                    <a href={`tel:${beach.phone}`} className="flex items-center gap-2 text-sm text-ocean hover:underline font-mono">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {beach.phone}
                    </a>
                  )}
                  {beach.town_beach_url && (
                    <a href={beach.town_beach_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-ocean hover:underline font-mono">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Official town page
                    </a>
                  )}
                  {beach.rating?.refreshed_at && (
                    <p className="text-[10px] font-mono text-stone-400 pt-1">Ratings updated {cacheAgeLabel(beach.rating.refreshed_at)}</p>
                  )}
                </div>

              </div>
            )}

            {/* Minimal card for beaches with no rich data */}
            {!hasCard && (
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <div className="px-4 py-3">
                  <a href={`https://maps.google.com/?q=${beach.lat},${beach.lng}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-ocean hover:underline font-mono">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Open in Google Maps
                  </a>
                  {beach.parking_info && <p className="text-xs text-stone-500 mt-2">{beach.parking_info}</p>}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
