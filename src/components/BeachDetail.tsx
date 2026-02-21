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

// ── Small sub-components ────────────────────────────────────────

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

function InfoRow({ icon, label, value, className }: { icon: string; label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-start gap-3 py-3 border-b border-stone-100 last:border-0 ${className ?? ''}`}>
      <span className="text-base w-5 text-center flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-0.5">{label}</p>
        <div className="text-sm text-stone-700 leading-snug">{value}</div>
      </div>
    </div>
  )
}

function AccessBadge({ accessType }: { accessType?: string }) {
  if (!accessType) return null
  const styles: Record<string, string> = {
    public: 'bg-green-50 text-green-700 border-green-200',
    sticker_required: 'bg-amber-50 text-amber-700 border-amber-200',
    resident_only: 'bg-red-50 text-red-600 border-red-200',
    residents_only: 'bg-red-50 text-red-600 border-red-200',
    national_seashore_pass: 'bg-blue-50 text-blue-700 border-blue-200',
  }
  const labels: Record<string, string> = {
    public: 'Free & Open',
    sticker_required: 'Sticker / Day Fee',
    resident_only: 'Residents Only',
    residents_only: 'Residents Only',
    national_seashore_pass: 'National Seashore Pass',
  }
  const icons: Record<string, string> = {
    public: '🟢',
    sticker_required: '🟡',
    resident_only: '🔴',
    residents_only: '🔴',
    national_seashore_pass: '🔵',
  }
  const key = accessType.toLowerCase()
  const style = styles[key] ?? 'bg-stone-50 text-stone-600 border-stone-200'
  const label = labels[key] ?? accessType
  const icon = icons[key] ?? '⚪'
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-mono font-medium px-3 py-1.5 rounded-full border ${style}`}>
      <span>{icon}</span>
      {label}
    </span>
  )
}

function WaveBadge({ intensity }: { intensity?: string }) {
  if (!intensity) return null
  const map = { calm: { label: 'Calm Water', color: 'text-teal-600', bars: 1 }, moderate: { label: 'Moderate', color: 'text-amber-600', bars: 2 }, surf: { label: 'Surf / Strong', color: 'text-blue-600', bars: 3 } }
  const info = map[intensity as keyof typeof map]
  if (!info) return null
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${info.color}`}>
      {Array.from({ length: 3 }).map((_, i) => (
        <span key={i} className={`inline-block w-1 rounded-full ${i < info.bars ? 'bg-current h-4' : 'bg-current opacity-20 h-2'}`} />
      ))}
      {info.label}
    </span>
  )
}

function SharkBadge({ risk }: { risk?: string }) {
  if (!risk) return null
  const map = { low: { label: 'Low Risk', color: 'text-emerald-600' }, moderate: { label: 'Moderate', color: 'text-amber-600' }, elevated: { label: 'Elevated', color: 'text-red-600' } }
  const info = map[risk as keyof typeof map]
  if (!info) return null
  return <span className={`text-sm font-medium ${info.color}`}>🦈 {info.label}</span>
}

function FacilityIcons({ beach }: { beach: BeachWithData }) {
  const items = [
    { show: beach.lifeguards === true, icon: '🏊', label: 'Lifeguards' },
    { show: beach.restrooms === true, icon: '🚻', label: 'Restrooms' },
    { show: beach.showers === true, icon: '🚿', label: 'Showers' },
    { show: beach.wheelchair_accessible === true, icon: '♿', label: 'Accessible' },
  ]
  const present = items.filter((i) => i.show)
  const absent = items.filter((i) => i.show === false && i.show !== undefined)

  if (present.length === 0 && absent.length === 0) return <span className="text-stone-400 text-sm">—</span>

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {present.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-1 text-sm text-stone-700">
          <span>{i.icon}</span>{i.label}
        </span>
      ))}
      {items.filter((i) => beach[`restrooms` as keyof typeof beach] === false && i.icon === '🚻').length > 0 && absent.length > 0 && (
        absent.map((i) => (
          <span key={i.label} className="inline-flex items-center gap-1 text-sm text-stone-400 line-through decoration-stone-300">
            <span className="opacity-50">{i.icon}</span>{i.label}
          </span>
        ))
      )}
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────

export default function BeachDetail({ beach }: Props) {
  const sortedPhotos = [...beach.photos].sort((a, b) => a.photo_index - b.photo_index)
  const [activeIdx, setActiveIdx] = useState(0)
  const activePhoto = sortedPhotos[activeIdx]

  const typeBadge = BEACH_TYPE_COLORS[beach.beach_type]
  const typeLabel = BEACH_TYPE_LABELS[beach.beach_type]

  // Determine if we have any rich data to show
  const hasRichData = !!(
    beach.access_type || beach.parking_info || beach.water_body ||
    beach.wave_intensity || beach.shark_risk || beach.lifeguards !== undefined ||
    beach.restrooms !== undefined || beach.dog_policy_allowed !== undefined ||
    beach.crowd_level || beach.beach_length_miles
  )

  const knownTags = beach.best_for.filter((t) => KNOWN_BEST_FOR.has(t as never))

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
            <Image
              src={activePhoto.storage_url}
              alt={`${beach.name} — photo ${activeIdx + 1}`}
              fill sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover" priority
            />
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
              <button key={photo.id} onClick={() => setActiveIdx(i)}
                aria-label={`View photo ${i + 1}`}
                className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === activeIdx ? 'border-ocean' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <Image src={photo.storage_url} alt={`Thumb ${i + 1}`} fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* ── Main content grid ── */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Left — title + description */}
          <div className="md:col-span-2">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-xs font-mono font-medium px-2.5 py-1 rounded-full ${typeBadge}`}>{typeLabel}</span>
              <AccessBadge accessType={beach.access_type} />
              {activePhoto && <CacheBadge cachedAt={activePhoto.cached_at} />}
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-800 mb-1">{beach.name}</h1>
            <p className="font-mono text-stone-500 text-sm uppercase tracking-widest mb-4">{beach.town}, Massachusetts</p>

            <StarRow rating={beach.rating?.rating ?? null} count={beach.rating?.rating_count ?? null} />

            <p className="mt-5 text-stone-600 leading-relaxed text-[15px]">{beach.description}</p>

            {/* Best for */}
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

            {/* Attribution */}
            {activePhoto?.attribution && (
              <p className="mt-5 text-xs font-mono text-stone-400">
                Photo by {activePhoto.attribution} via Google Places
              </p>
            )}
          </div>

          {/* Right — info card */}
          <div className="space-y-4">

            {/* At a Glance card */}
            {hasRichData && (
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-stone-100">
                  <h2 className="text-xs font-mono font-semibold text-stone-500 uppercase tracking-wider">At a Glance</h2>
                </div>
                <div className="px-4 divide-y divide-stone-100">
                  {beach.access_type && (
                    <InfoRow icon="🅿️" label="Access" value={<AccessBadge accessType={beach.access_type} />} />
                  )}
                  {beach.daily_parking_fee !== undefined && beach.daily_parking_fee !== null && (
                    <InfoRow icon="💵" label="Daily Parking" value={`$${beach.daily_parking_fee}`} />
                  )}
                  {beach.daily_parking_fee === null && beach.access_type === 'resident_only' && (
                    <InfoRow icon="💵" label="Daily Parking" value="Not available (sticker only)" />
                  )}
                  {beach.water_body && (
                    <InfoRow icon="🌊" label="Water Body" value={beach.water_body} />
                  )}
                  {beach.avg_water_temp_f && (
                    <InfoRow icon="🌡️" label="Summer Water Temp" value={`${beach.avg_water_temp_f}°F`} />
                  )}
                  {beach.wave_intensity && (
                    <InfoRow icon="〰️" label="Wave Intensity" value={<WaveBadge intensity={beach.wave_intensity} />} />
                  )}
                  {beach.shark_risk && (
                    <InfoRow icon="🦈" label="Shark Risk" value={<SharkBadge risk={beach.shark_risk} />} />
                  )}
                  {(beach.lifeguards !== undefined || beach.restrooms !== undefined || beach.showers !== undefined || beach.wheelchair_accessible !== undefined) && (
                    <InfoRow icon="🏖️" label="Facilities" value={<FacilityIcons beach={beach} />} />
                  )}
                  {beach.lifeguards && beach.lifeguard_season && (
                    <InfoRow icon="🏊" label="Lifeguard Hours" value={
                      <span>{beach.lifeguard_season}{beach.lifeguard_hours ? `, ${beach.lifeguard_hours}` : ''}</span>
                    } />
                  )}
                  {beach.dog_policy_allowed !== undefined && (
                    <InfoRow
                      icon="🐕"
                      label="Dogs"
                      value={
                        <span className={beach.dog_policy_allowed ? 'text-green-700' : 'text-red-600'}>
                          {beach.dog_policy_allowed ? '✓ Allowed' : '✗ Not allowed in season'}
                          {beach.dog_policy_details && (
                            <span className="block text-xs text-stone-500 mt-0.5">{beach.dog_policy_details}</span>
                          )}
                        </span>
                      }
                    />
                  )}
                  {beach.crowd_level && (
                    <InfoRow icon="👥" label="Crowd Level" value={
                      <span className={{ low: 'text-green-700', moderate: 'text-amber-600', high: 'text-red-600' }[beach.crowd_level] ?? ''}>
                        {{ low: '● Low', moderate: '● Moderate', high: '● High' }[beach.crowd_level]}
                      </span>
                    } />
                  )}
                  {beach.beach_length_miles && (
                    <InfoRow icon="📏" label="Beach Length" value={`~${beach.beach_length_miles} mile${beach.beach_length_miles !== 1 ? 's' : ''}`} />
                  )}
                  {beach.food_nearby && (
                    <InfoRow icon="🍦" label="Food Nearby" value={beach.food_nearby} />
                  )}
                  {beach.parking_info && !beach.access_type && (
                    <InfoRow icon="🚗" label="Parking" value={beach.parking_info} />
                  )}
                </div>
              </div>
            )}

            {/* If no rich data, show parking info as simple card */}
            {!hasRichData && beach.parking_info && (
              <div className="bg-white rounded-2xl border border-stone-200 px-4 py-3">
                <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Parking</p>
                <p className="text-sm text-stone-700">{beach.parking_info}</p>
              </div>
            )}

            {/* Google Maps */}
            <div className="bg-white rounded-2xl border border-stone-200 px-4 py-3">
              <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-2">Location</p>
              <a
                href={`https://maps.google.com/?q=${beach.lat},${beach.lng}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-ocean hover:underline font-mono"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Open in Google Maps
              </a>
              {beach.rating?.refreshed_at && (
                <p className="text-[10px] font-mono text-stone-400 mt-2">Ratings updated {cacheAgeLabel(beach.rating.refreshed_at)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
