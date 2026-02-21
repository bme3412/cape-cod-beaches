import BeachGrid from '@/components/BeachGrid'
import type { BeachWithData } from '@/types/beach'

async function getBeaches(): Promise<BeachWithData[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  try {
    const res = await fetch(`${baseUrl}/api/beaches`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export const metadata = {
  title: 'Cape Cod Beach Guide — The Best Beaches on the Cape',
  description:
    'A curated guide to the best beaches on Cape Cod, MA. From the wild surf of the Outer Cape to the calm, warm waters of Nantucket Sound.',
}

export default async function HomePage() {
  const beaches = await getBeaches()

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

          {/* Stats */}
          <div className="flex gap-8 mt-8">
            <div>
              <p className="font-display text-2xl font-bold text-stone-800">{beaches.length}</p>
              <p className="text-xs font-mono text-stone-500 uppercase tracking-wide">Beaches</p>
            </div>
            <div className="w-px bg-stone-200" />
            <div>
              <p className="font-display text-2xl font-bold text-stone-800">15</p>
              <p className="text-xs font-mono text-stone-500 uppercase tracking-wide">Towns</p>
            </div>
            <div className="w-px bg-stone-200" />
            <div>
              <p className="font-display text-2xl font-bold text-stone-800">0</p>
              <p className="text-xs font-mono text-stone-500 uppercase tracking-wide">API calls on page load</p>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-ocean via-seafoam to-sand opacity-60" />
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        {beaches.length === 0 ? (
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
        ) : (
          <BeachGrid beaches={beaches} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 mt-16 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-stone-400">
            Photos cached from Google Places · Ratings refreshed weekly
          </p>
          <p className="text-xs font-mono text-stone-400">
            Built with love for the Cape ·{' '}
            <span className="text-ocean">~$0.88/mo</span> to run
          </p>
        </div>
      </footer>
    </div>
  )
}
