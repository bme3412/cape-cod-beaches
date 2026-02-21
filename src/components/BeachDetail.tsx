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
  renderStars,
} from '@/lib/utils'

interface Props {
  beach: BeachWithData
}

function CacheBadge({ cachedAt }: { cachedAt: string }) {
  const age = cacheAge(cachedAt)
  const label = cacheAgeLabel(cachedAt)

  const styles = {
    fresh: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    aging: 'bg-amber-50 text-amber-700 border-amber-200',
    stale: 'bg-red-50 text-red-700 border-red-200',
  }

  const dots = {
    fresh: 'bg-emerald-500',
    aging: 'bg-amber-500',
    stale: 'bg-red-500',
  }

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
            <defs>
              <linearGradient id="half-lg">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#e7e5e4" />
              </linearGradient>
            </defs>
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
      {count && (
        <span className="text-stone-400 text-sm font-mono">
          ({count.toLocaleString()} reviews)
        </span>
      )}
    </div>
  )
}

export default function BeachDetail({ beach }: Props) {
  const sortedPhotos = [...beach.photos].sort((a, b) => a.photo_index - b.photo_index)
  const [activeIdx, setActiveIdx] = useState(0)
  const activePhoto = sortedPhotos[activeIdx]

  const typeBadge = BEACH_TYPE_COLORS[beach.beach_type]
  const typeLabel = BEACH_TYPE_LABELS[beach.beach_type]

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Back nav */}
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-mono text-stone-500 hover:text-ocean transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All Beaches
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        {/* Hero photo */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-stone-200 mb-4">
          {activePhoto ? (
            <Image
              src={activePhoto.storage_url}
              alt={`${beach.name} — photo ${activeIdx + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Prev / Next arrows */}
          {sortedPhotos.length > 1 && (
            <>
              <button
                onClick={() => setActiveIdx((i) => (i - 1 + sortedPhotos.length) % sortedPhotos.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors"
                aria-label="Previous photo"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setActiveIdx((i) => (i + 1) % sortedPhotos.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors"
                aria-label="Next photo"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Photo counter */}
          {sortedPhotos.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs font-mono px-2 py-1 rounded-full">
              {activeIdx + 1} / {sortedPhotos.length}
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {sortedPhotos.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {sortedPhotos.map((photo, i) => (
              <button
                key={photo.id}
                onClick={() => setActiveIdx(i)}
                className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  i === activeIdx ? 'border-ocean' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={photo.storage_url}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Info grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* Header */}
            <div className="flex flex-wrap items-start gap-3 mb-3">
              <span className={`text-xs font-mono font-medium px-2.5 py-1 rounded-full ${typeBadge}`}>
                {typeLabel}
              </span>
              {activePhoto && <CacheBadge cachedAt={activePhoto.cached_at} />}
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-800 mb-1">
              {beach.name}
            </h1>
            <p className="font-mono text-stone-500 text-sm uppercase tracking-widest mb-4">
              {beach.town}, Massachusetts
            </p>

            <StarRow rating={beach.rating?.rating ?? null} count={beach.rating?.rating_count ?? null} />

            <p className="mt-5 text-stone-600 leading-relaxed text-[15px]">{beach.description}</p>

            {/* Attribution */}
            {activePhoto?.attribution && (
              <p className="mt-4 text-xs font-mono text-stone-400">
                Photo by {activePhoto.attribution} via Google Places
              </p>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Best for */}
            <div>
              <h3 className="font-mono text-xs text-stone-400 uppercase tracking-widest mb-2">
                Best For
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {beach.best_for.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2.5 py-1 bg-stone-100 text-stone-700 rounded-full"
                  >
                    {BEST_FOR_LABELS[tag]}
                  </span>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="font-mono text-xs text-stone-400 uppercase tracking-widest mb-2">
                Location
              </h3>
              <a
                href={`https://maps.google.com/?q=${beach.lat},${beach.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-ocean hover:underline font-mono"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Open in Google Maps
              </a>
            </div>

            {/* Ratings freshness */}
            {beach.rating?.refreshed_at && (
              <div>
                <h3 className="font-mono text-xs text-stone-400 uppercase tracking-widest mb-2">
                  Ratings Updated
                </h3>
                <p className="text-xs font-mono text-stone-500">
                  {cacheAgeLabel(beach.rating.refreshed_at)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
