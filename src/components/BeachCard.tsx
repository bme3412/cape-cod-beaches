'use client'

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

function CacheDot({ cachedAt }: { cachedAt: string }) {
  const age = cacheAge(cachedAt)
  const label = cacheAgeLabel(cachedAt)

  const colors = {
    fresh: 'bg-emerald-400',
    aging: 'bg-amber-400',
    stale: 'bg-red-400',
  }

  return (
    <span
      className="flex items-center gap-1 text-[10px] font-mono text-stone-400"
      title={`Photo cached: ${label}`}
    >
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${colors[age]}`} />
      {label}
    </span>
  )
}

function StarRating({ rating }: { rating: number | null }) {
  if (rating === null) return <span className="text-stone-400 text-xs font-mono">No rating</span>

  const { full, half, empty } = renderStars(rating)

  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`f${i}`} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {half && (
        <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half)"
            stroke="currentColor"
            strokeWidth="0.5"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`e${i}`} className="w-3.5 h-3.5 text-stone-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs font-mono text-stone-500">{rating.toFixed(1)}</span>
    </span>
  )
}

export default function BeachCard({ beach }: Props) {
  const primaryPhoto = beach.photos.find((p) => p.photo_index === 0)
  const typeLabel = BEACH_TYPE_LABELS[beach.beach_type]
  const typeBadge = BEACH_TYPE_COLORS[beach.beach_type]

  return (
    <Link href={`/beach/${beach.id}`} className="group block">
      <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-stone-100">
        {/* Photo */}
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
          {primaryPhoto ? (
            <Image
              src={primaryPhoto.storage_url}
              alt={beach.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-12 h-12 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Beach type badge */}
          <div className="absolute top-3 left-3">
            <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-full ${typeBadge}`}>
              {typeLabel}
            </span>
          </div>

          {/* Cache freshness */}
          {primaryPhoto && (
            <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
              <CacheDot cachedAt={primaryPhoto.cached_at} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h2 className="font-display text-lg font-semibold text-stone-800 leading-tight group-hover:text-ocean transition-colors">
              {beach.name}
            </h2>
          </div>

          <p className="text-xs font-mono text-stone-500 mb-2 uppercase tracking-wide">
            {beach.town}, MA
          </p>

          <div className="mb-3">
            <StarRating rating={beach.rating?.rating ?? null} />
            {beach.rating?.rating_count && (
              <span className="text-[10px] font-mono text-stone-400 ml-1">
                ({beach.rating.rating_count.toLocaleString()})
              </span>
            )}
          </div>

          {/* Best for tags */}
          <div className="flex flex-wrap gap-1">
            {beach.best_for.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded"
              >
                {BEST_FOR_LABELS[tag]}
              </span>
            ))}
            {beach.best_for.length > 4 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-stone-100 text-stone-400 rounded">
                +{beach.best_for.length - 4}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
