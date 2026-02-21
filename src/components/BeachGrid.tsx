'use client'

import { useState, useMemo } from 'react'
import BeachCard from './BeachCard'
import FilterBar from './FilterBar'
import type { BeachWithData, FilterType, BeachType } from '@/types/beach'

interface Props {
  beaches: BeachWithData[]
}

type SortOption = 'alpha' | 'rating' | 'reviews'

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
    if (sort === 'rating') {
      return (b.rating?.rating ?? 0) - (a.rating?.rating ?? 0)
    }
    if (sort === 'reviews') {
      return (b.rating?.rating_count ?? 0) - (a.rating?.rating_count ?? 0)
    }
    return a.name.localeCompare(b.name)
  })
}

export default function BeachGrid({ beaches }: Props) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortOption>('alpha')
  const [search, setSearch] = useState('')

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

    if (filter !== 'all') {
      result = result.filter((b) => b.beach_type === filter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.town.toLowerCase().includes(q)
      )
    }

    return sortBeaches(result, sort)
  }, [beaches, filter, search, sort])

  // Group by region only when showing all types and no search
  const showGrouped = filter === 'all' && !search.trim()

  const grouped = useMemo(() => {
    if (!showGrouped) return null
    const map: Record<string, BeachWithData[]> = {}
    for (const b of filtered) {
      const region = (b as BeachWithData & { region?: string }).region ?? 'other'
      if (!map[region]) map[region] = []
      map[region].push(b)
    }
    // Return in defined order, then any unexpected regions at the end
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

  return (
    <div>
      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
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
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="pl-4 pr-8 py-2 text-sm font-mono bg-white border border-stone-200 rounded-full focus:outline-none focus:border-ocean text-stone-600 appearance-none cursor-pointer"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2378716c' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
        >
          <option value="alpha">Sort: A – Z</option>
          <option value="rating">Sort: Highest Rated</option>
          <option value="reviews">Sort: Most Reviewed</option>
        </select>
      </div>

      {/* Filter bar */}
      <div className="mb-6">
        <FilterBar active={filter} onChange={setFilter} counts={counts} />
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-stone-400 font-mono">
          No beaches match your search.
        </div>
      ) : showGrouped && grouped ? (
        // Grouped by region
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
        // Flat grid (filtered or search active)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((beach) => (
            <BeachCard key={beach.id} beach={beach} />
          ))}
        </div>
      )}

      <p className="mt-8 text-center text-xs font-mono text-stone-400">
        Showing {filtered.length} of {beaches.length} beaches
      </p>
    </div>
  )
}
