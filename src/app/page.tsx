import { Suspense } from 'react'
import { createClient } from '@supabase/supabase-js'
import BeachGrid from '@/components/BeachGrid'
import { SkeletonGrid } from '@/components/BeachCardSkeleton'
import type { BeachWithData } from '@/types/beach'

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

// Separate async component so Suspense can stream it independently
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

  return <BeachGrid beaches={beaches} />
}

export const metadata = {
  title: 'Cape Cod Beach Guide — The Best Beaches on the Cape',
  description:
    'A curated guide to the best beaches on Cape Cod, MA. From the wild surf of the Outer Cape to the calm, warm waters of Nantucket Sound.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Hero */}
      <header className="relative overflow-hidden bg-[#faf8f5] border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <p className="font-mono text-xs text-ocean uppercase tracking-[0.2em] mb-3">
              Cape Cod, Massachusetts
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-stone-800 leading-[1.1] mb-4">
              The&nbsp;Cape&apos;s Best
              <br />
              <span className="text-ocean">Beaches</span>
            </h1>
            <p className="text-stone-500 text-lg leading-relaxed max-w-xl">
              From the thundering surf of the National Seashore to the calm, warm shallows of
              Nantucket Sound — a local&apos;s guide to the water&apos;s edge.
            </p>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-ocean via-seafoam to-sand opacity-60" />
      </header>

      {/* Main content — streamed with Suspense */}
      <main className="max-w-5xl mx-auto px-4 py-10">
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
