'use client'

import { useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import BeachCard from './BeachCard'
import FilterBar from './FilterBar'
import type { BeachWithData, FilterType, BeachType, BestFor } from '@/types/beach'
import { BEST_FOR_LABELS } from '@/lib/utils'

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-2xl bg-stone-100 animate-pulse border border-stone-200" style={{ height: 560 }} />
  ),
})

interface Props {
  beaches: BeachWithData[]
}

type SortOption = 'alpha' | 'rating' | 'reviews'
type ViewMode = 'grid' | 'map'

const REGION_ORDER = [
  'upper_cape',
  'mid_cape',
  'lower_cape',
  'outer_cape',
  'nantucket',
  'marthas_vineyard',
] as const

const REGION_LABELS: Record<string, string> = {
  upper_cape: 'Upper Cape',
  mid_cape: 'Mid Cape',
  lower_cape: 'Lower Cape',
  outer_cape: 'Outer Cape',
  nantucket: 'Nantucket',
  marthas_vineyard: "Martha's Vineyard",
}

function sortBeaches(beaches: BeachWithData[], sort: SortOption): BeachWithData[] {
  return [...beaches].sort((a, b) => {
    if (sort === 'rating') return (b.rating?.rating ?? 0) - (a.rating?.rating ?? 0)
    if (sort === 'reviews') return (b.rating?.rating_count ?? 0) - (a.rating?.rating_count ?? 0)
    return a.name.localeCompare(b.name)
  })
}

export default function BeachGrid({ beaches }: Props) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortOption>('alpha')
  const [search, setSearch] = useState('')
  const [bestForFilter, setBestForFilter] = useState<BestFor | null>(null)
  const [view, setView] = useState<ViewMode>('grid')

  // All unique best_for tags across all beaches, sorted by frequency
  const allTags = useMemo(() => {
    const freq: Partial<Record<BestFor, number>> = {}
    for (const b of beaches) {
      for (const tag of b.best_for) {
        freq[tag] = (freq[tag] ?? 0) + 1
      }
    }
    return (Object.entries(freq) as [BestFor, number][])
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
  }, [beaches])

  const counts = useMemo(() => {
    const c: Record<FilterType, number> = {
      all: beaches.length,
      ocean_surf: 0,
      bay_calm: 0,
      sound: 0,
      dunes: 0,
      national_seashore: 0,
      harbor: 0,
    }
    for (const b of beaches) {
      if (b.beach_type in c) c[b.beach_type as BeachType]++
    }
    return c
  }, [beaches])

  const filtered = useMemo(() => {
    let result = beaches
    if (filter !== 'all') result = result.filter((b) => b.beach_type === filter)
    if (bestForFilter) result = result.filter((b) => b.best_for.includes(bestForFilter))
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (b) => b.name.toLowerCase().includes(q) || b.town.toLowerCase().includes(q)
      )
    }
    return sortBeaches(result, sort)
  }, [beaches, filter, bestForFilter, search, sort])

  const activeFilterCount = [
    filter !== 'all',
    bestForFilter !== null,
    search.trim() !== '',
    sort !== 'alpha',
  ].filter(Boolean).length

  const showGrouped = filter === 'all' && !search.trim() && !bestForFilter

  const grouped = useMemo(() => {
    if (!showGrouped) return null
    const map: Record<string, BeachWithData[]> = {}
    for (const b of filtered) {
      const region = (b as BeachWithData & { region?: string }).region ?? 'other'
      if (!map[region]) map[region] = []
      map[region].push(b)
    }
    const ordered: { region: string; beaches: BeachWithData[] }[] = []
    for (const r of REGION_ORDER) {
      if (map[r]?.length) ordered.push({ region: r, beaches: map[r] })
    }
    for (const r of Object.keys(map)) {
      if (!REGION_ORDER.includes(r as typeof REGION_ORDER[number])) {
        ordered.push({ region: r, beaches: map[r] })
      }
    }
    return ordered
  }, [filtered, showGrouped])

  const clearAll = useCallback(() => {
    setFilter('all')
    setBestForFilter(null)
    setSearch('')
    setSort('alpha')
  }, [])

  return (
    <div>
      {/* ── Sticky controls wrapper ── */}
      <div className="sticky top-0 z-20 bg-[#faf8f5] pt-2 pb-4 -mx-4 px-4 border-b border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        {/* Search + Sort + View toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search beaches or towns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm font-mono bg-white border border-stone-200 rounded-full focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean/20 placeholder:text-stone-400 text-stone-700"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="flex-1 sm:flex-none pl-4 pr-8 py-2 text-sm font-mono bg-white border border-stone-200 rounded-full focus:outline-none focus:border-ocean text-stone-600 appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2378716c' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              <option value="alpha">A – Z</option>
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviewed</option>
            </select>

            {/* Grid / Map toggle */}
            <div className="flex rounded-full border border-stone-200 bg-white overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`px-3 py-2 transition-colors ${view === 'grid' ? 'bg-ocean text-white' : 'text-stone-500 hover:text-stone-700'}`}
                title="Grid view"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setView('map')}
                className={`px-3 py-2 transition-colors ${view === 'map' ? 'bg-ocean text-white' : 'text-stone-500 hover:text-stone-700'}`}
                title="Map view"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Beach type filter bar */}
        <div className="mb-3">
          <FilterBar active={filter} onChange={setFilter} counts={counts} />
        </div>

        {/* Best for chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setBestForFilter(bestForFilter === tag ? null : tag)}
              className={`flex-shrink-0 text-[11px] font-mono px-2.5 py-1 rounded-full border transition-all ${
                bestForFilter === tag
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-700'
              }`}
            >
              {BEST_FOR_LABELS[tag]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Active filter summary ── */}
      <div className="flex items-center justify-between mt-4 mb-5 min-h-[20px]">
        <p className="text-xs font-mono text-stone-400">
          {filtered.length === beaches.length ? (
            `${beaches.length} beaches`
          ) : (
            <>
              <span className="text-stone-600 font-medium">{filtered.length}</span> of {beaches.length} beaches
              {filter !== 'all' && <> · <span className="text-ocean">{filter.replace('_', ' / ')}</span></>}
              {bestForFilter && <> · <span className="text-stone-600">{BEST_FOR_LABELS[bestForFilter]}</span></>}
              {search.trim() && <> · matching &ldquo;<span className="text-stone-600">{search}</span>&rdquo;</>}
              {sort !== 'alpha' && <> · {sort === 'rating' ? 'top rated' : 'most reviewed'}</>}
            </>
          )}
        </p>
        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="text-[11px] font-mono text-stone-400 hover:text-ocean transition-colors">
            Clear all ×
          </button>
        )}
      </div>

      {/* ── Content ── */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-stone-400 font-mono mb-2">No beaches match your filters.</p>
          <button onClick={clearAll} className="text-sm text-ocean font-mono hover:underline">
            Clear all filters
          </button>
        </div>
      ) : view === 'map' ? (
        <MapView beaches={filtered} />
      ) : showGrouped && grouped ? (
        <div className="space-y-10">
          {grouped.map(({ region, beaches: group }) => (
            <section key={region}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-display text-xl font-semibold text-stone-700">
                  {REGION_LABELS[region] ?? region}
                </h2>
                <span className="text-xs font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                  {group.length}
                </span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.map((beach) => (
                  <BeachCard key={beach.id} beach={beach} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((beach) => (
            <BeachCard key={beach.id} beach={beach} />
          ))}
        </div>
      )}
    </div>
  )
}
