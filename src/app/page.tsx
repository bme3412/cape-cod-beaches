import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import BeachGrid from '@/components/BeachGrid'
import { SkeletonGrid } from '@/components/BeachCardSkeleton'
import type { BeachWithData } from '@/types/beach'
import { BEACH_TYPE_LABELS, BEACH_TYPE_COLORS, renderStars } from '@/lib/utils'

async function getBeaches(): Promise<BeachWithData[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) return []

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: beaches } = await supabase
    .from('beaches')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (!beaches || beaches.length === 0) return []

  const beachIds = beaches.map((b) => b.id)

  const [{ data: photos }, { data: ratings }] = await Promise.all([
    supabase.from('beach_photos').select('*').in('beach_id', beachIds).order('photo_index'),
    supabase.from('beach_ratings').select('*').in('beach_id', beachIds),
  ])

  type PhotoRow = NonNullable<typeof photos>[0]
  type RatingRow = NonNullable<typeof ratings>[0]

  const photosByBeach = (photos ?? []).reduce<Record<string, PhotoRow[]>>((acc, p) => {
    if (!acc[p.beach_id]) acc[p.beach_id] = []
    acc[p.beach_id].push(p)
    return acc
  }, {})

  const ratingsById = (ratings ?? []).reduce<Record<string, RatingRow>>((acc, r) => {
    acc[r.beach_id] = r
    return acc
  }, {})

  return beaches.map((beach) => ({
    ...beach,
    photos: photosByBeach[beach.id] ?? [],
    rating: ratingsById[beach.id] ?? null,
  })) as BeachWithData[]
}

// Pick featured beach: highest-rated with a photo
function pickFeatured(beaches: BeachWithData[]): BeachWithData | null {
  return (
    [...beaches]
      .filter((b) => b.photos.length > 0 && b.rating?.rating)
      .sort((a, b) => (b.rating?.rating ?? 0) - (a.rating?.rating ?? 0))[0] ?? null
  )
}

async function BeachSection() {
  const beaches = await getBeaches()

  if (beaches.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="inline-flex flex-col items-center gap-4">
          <svg className="w-16 h-16 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <div>
            <p className="font-display text-xl text-stone-600 mb-1">No beaches yet</p>
            <p className="text-sm font-mono text-stone-400">
              Run <code className="bg-stone-100 px-1 rounded">npx tsx scripts/seed.ts</code> to populate the database.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const featured = pickFeatured(beaches)

  return (
    <>
      {featured && <FeaturedHero beach={featured} total={beaches.length} />}
      <BeachGrid beaches={beaches} />
    </>
  )
}

function FeaturedHero({ beach, total }: { beach: BeachWithData; total: number }) {
  const photo = beach.photos[0]
  const stars = renderStars(beach.rating?.rating ?? null)
  const typeLabel = BEACH_TYPE_LABELS[beach.beach_type]

  return (
    <section className="mb-8 -mx-4">
      <Link href={`/beach/${beach.id}`} className="block group">
        <div className="relative h-[380px] sm:h-[440px] overflow-hidden">
          {/* Background photo */}
          {photo && (
            <Image
              src={photo.storage_url}
              alt={beach.name}
              fill
              sizes="100vw"
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

          {/* "Featured" badge */}
          <div className="absolute top-5 left-5">
            <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-stone-700 text-[11px] font-mono font-semibold px-3 py-1.5 rounded-full shadow-sm">
              <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Featured Beach
            </span>
          </div>

          {/* Stats badge */}
          <div className="absolute top-5 right-5">
            <span className="bg-black/40 backdrop-blur-sm text-white text-[11px] font-mono px-3 py-1.5 rounded-full">
              {total} beaches in the guide
            </span>
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-[11px] font-mono font-medium px-2.5 py-1 rounded-full ${BEACH_TYPE_COLORS[beach.beach_type]}`}>
                {typeLabel}
              </span>
              <span className="text-xs font-mono text-white/70">
                {beach.town}, MA
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight drop-shadow-sm">
              {beach.name}
            </h2>

            {/* Stars */}
            {beach.rating?.rating && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: stars.full }).map((_, i) => (
                    <svg key={`f${i}`} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  {stars.half && (
                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" clipPath="url(#half)" />
                      <defs><clipPath id="half"><rect x="0" y="0" width="12" height="24" /></clipPath></defs>
                    </svg>
                  )}
                  {Array.from({ length: stars.empty }).map((_, i) => (
                    <svg key={`e${i}`} className="w-4 h-4 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-mono text-white/80">
                  {beach.rating.rating.toFixed(1)}
                  {beach.rating.rating_count && (
                    <span className="text-white/50"> ({beach.rating.rating_count.toLocaleString()})</span>
                  )}
                </span>
              </div>
            )}

            <p className="text-sm text-white/75 leading-relaxed max-w-xl line-clamp-2 mb-4">
              {beach.description}
            </p>

            <span className="inline-flex items-center gap-1.5 bg-white text-stone-800 text-sm font-semibold px-5 py-2.5 rounded-full shadow-md group-hover:shadow-lg transition-shadow">
              Explore this beach
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </section>
  )
}

export const metadata = {
  title: 'Cape Cod Beach Guide — The Best Beaches on the Cape',
  description:
    'A curated guide to the best beaches on Cape Cod, MA. From the wild surf of the Outer Cape to the calm, warm waters of Nantucket Sound.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <header className="relative overflow-hidden bg-[#faf8f5] border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-12">
          <div className="max-w-2xl">
            <p className="font-mono text-xs text-ocean uppercase tracking-[0.2em] mb-3">
              Cape Cod, Massachusetts
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-stone-800 leading-[1.1] mb-3">
              The&nbsp;Cape&apos;s Best
              <br />
              <span className="text-ocean">Beaches</span>
            </h1>
            <p className="text-stone-500 leading-relaxed max-w-xl">
              From the thundering surf of the National Seashore to the calm, warm shallows of
              Nantucket Sound — a local&apos;s guide to the water&apos;s edge.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-ocean via-seafoam to-sand opacity-60" />
      </header>

      {/* Main content — streamed */}
      <main className="max-w-5xl mx-auto px-4 pt-6 pb-10">
        <Suspense fallback={<SkeletonGrid />}>
          <BeachSection />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 mt-16 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-mono text-stone-400 text-center">
            Photos cached from Google Places · Ratings refreshed weekly
          </p>
        </div>
      </footer>
    </div>
  )
}
