'use client'

import { useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import BeachCard from './BeachCard'
import FilterBar from './FilterBar'
import type { BeachWithData, FilterType, BeachType, BestFor } from '@/types/beach'
import { BEST_FOR_LABELS, BEST_FOR_ICONS, KNOWN_BEST_FOR } from '@/lib/utils'

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
  'upper_cape', 'mid_cape', 'lower_cape', 'outer_cape', 'nantucket', 'marthas_vineyard',
] as const

const REGION_LABELS: Record<string, string> = {
  upper_cape: 'Upper Cape',
  mid_cape: 'Mid Cape',
  lower_cape: 'Lower Cape',
  outer_cape: 'Outer Cape',
  nantucket: 'Nantucket',
  marthas_vineyard: "Martha's Vineyard",
}

const TOWN_GROUPS = [
  { label: 'Upper Cape', towns: ['Bourne', 'Sandwich', 'Barnstable', 'Falmouth', 'Mashpee', 'Centerville', 'Cotuit', 'Osterville', 'Hyannis', 'Hyannisport'] },
  { label: 'Mid Cape', towns: ['Yarmouth', 'Dennis', 'Brewster', 'Harwich', 'Chatham', 'Orleans'] },
  { label: 'Lower Cape', towns: ['Eastham', 'Wellfleet'] },
  { label: 'Outer Cape', towns: ['Truro', 'Provincetown'] },
  { label: 'Nantucket', towns: ['Nantucket'] },
  { label: "Martha's Vineyard", towns: ['Edgartown', 'Oak Bluffs', 'Vineyard Haven', 'Chilmark', 'Aquinnah', 'West Tisbury'] },
]

function sortBeaches(beaches: BeachWithData[], sort: SortOption): BeachWithData[] {
  return [...beaches].sort((a, b) => {
    if (sort === 'rating') return (b.rating?.rating ?? 0) - (a.rating?.rating ?? 0)
    if (sort === 'reviews') return (b.rating?.rating_count ?? 0) - (a.rating?.rating_count ?? 0)
    return a.name.localeCompare(b.name)
  })
}

const selectCls = 'pl-3 pr-7 py-2 text-xs font-mono bg-white border border-stone-200 rounded-full focus:outline-none focus:border-ocean/60 text-stone-600 appearance-none cursor-pointer'
const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2378716c' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat' as const,
  backgroundPosition: 'right 10px center',
}

export default function BeachGrid({ beaches }: Props) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortOption>('alpha')
  const [search, setSearch] = useState('')
  const [bestForFilter, setBestForFilter] = useState<BestFor | ''>('')
  const [townFilter, setTownFilter] = useState('')
  const [view, setView] = useState<ViewMode>('grid')

  const allTags = useMemo(() => {
    const freq: Partial<Record<BestFor, number>> = {}
    for (const b of beaches) {
      for (const tag of b.best_for) {
        if (KNOWN_BEST_FOR.has(tag as BestFor)) {
          freq[tag as BestFor] = (freq[tag as BestFor] ?? 0) + 1
        }
      }
    }
    return (Object.entries(freq) as [BestFor, number][])
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
  }, [beaches])

  const counts = useMemo(() => {
    const c: Record<FilterType, number> = { all: beaches.length, ocean_surf: 0, bay_calm: 0, sound: 0, dunes: 0, national_seashore: 0, harbor: 0 }
    for (const b of beaches) {
      if (b.beach_type in c) c[b.beach_type as BeachType]++
    }
    return c
  }, [beaches])

  const filtered = useMemo(() => {
    let result = beaches
    if (filter !== 'all') result = result.filter((b) => b.beach_type === filter)
    if (townFilter) result = result.filter((b) => b.town === townFilter)
    if (bestForFilter) result = result.filter((b) => (b.best_for as string[]).includes(bestForFilter))
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((b) => b.name.toLowerCase().includes(q) || b.town.toLowerCase().includes(q))
    }
    return sortBeaches(result, sort)
  }, [beaches, filter, townFilter, bestForFilter, search, sort])

  const anyFilterActive = filter !== 'all' || townFilter !== '' || bestForFilter !== '' || search.trim() !== '' || sort !== 'alpha'

  const showGrouped = filter === 'all' && !townFilter && !search.trim() && !bestForFilter

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
    setTownFilter('')
    setBestForFilter('')
    setSearch('')
    setSort('alpha')
  }, [])

  return (
    <div>
      {/* ── Sticky 2-row controls ── */}
      <div className="sticky top-0 z-20 bg-[#faf8f5] pt-3 pb-3 -mx-4 px-4 border-b border-stone-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">

        {/* Row 1 — Search + Sort + View */}
        <div className="flex gap-2 mb-2.5">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search beaches or towns…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-8 py-2 text-sm font-mono bg-white border border-stone-200 rounded-full focus:outline-none focus:border-ocean/60 focus:ring-2 focus:ring-ocean/10 placeholder:text-stone-400 text-stone-700"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600" aria-label="Clear">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)} className={selectCls} style={selectStyle} title="Sort order" aria-label="Sort order">
            <option value="alpha">A – Z</option>
            <option value="rating">Top Rated</option>
            <option value="reviews">Most Reviewed</option>
          </select>

          <div className="flex rounded-full border border-stone-200 bg-white overflow-hidden flex-shrink-0">
            <button onClick={() => setView('grid')} title="Grid" className={`px-2.5 py-2 transition-colors ${view === 'grid' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-stone-700'}`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button onClick={() => setView('map')} title="Map" className={`px-2.5 py-2 transition-colors ${view === 'map' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-stone-700'}`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Row 2 — Type pills + Town + Best For dropdowns */}
        <div className="flex items-center gap-2">
          {/* Type pills — scrollable, takes remaining space */}
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <FilterBar active={filter} onChange={setFilter} counts={counts} />
          </div>

          {/* Thin divider */}
          <div className="w-px h-6 bg-stone-200 flex-shrink-0" />

          {/* Town dropdown */}
          <select
            value={townFilter}
            onChange={(e) => setTownFilter(e.target.value)}
            className={`${selectCls} flex-shrink-0`}
            style={selectStyle}
            title="Filter by town"
            aria-label="Filter by town"
          >
            <option value="">Town</option>
            {TOWN_GROUPS.map(({ label, towns }) => (
              <optgroup key={label} label={label}>
                {towns.map((town) => {
                  const count = beaches.filter((b) => b.town === town).length
                  return count > 0 ? (
                    <option key={town} value={town}>{town} ({count})</option>
                  ) : null
                })}
              </optgroup>
            ))}
          </select>

          {/* Best For dropdown */}
          <select
            value={bestForFilter}
            onChange={(e) => setBestForFilter(e.target.value as BestFor | '')}
            className={`${selectCls} flex-shrink-0`}
            style={selectStyle}
            title="Filter by activity"
            aria-label="Filter by activity"
          >
            <option value="">Best For</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {BEST_FOR_ICONS[tag]} {BEST_FOR_LABELS[tag]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Filter summary ── */}
      <div className="flex items-center justify-between mt-4 mb-5 min-h-[18px]">
        <p className="text-xs font-mono text-stone-400">
          {!anyFilterActive ? (
            `${beaches.length} beaches`
          ) : (
            <>
              <span className="text-stone-700 font-medium">{filtered.length}</span> of {beaches.length}
              {filter !== 'all' && <> · <span className="text-ocean">{filter.replace(/_/g, ' / ')}</span></>}
              {townFilter && <> · <span className="text-stone-700">{townFilter}</span></>}
              {bestForFilter && <> · {BEST_FOR_ICONS[bestForFilter as BestFor]} {BEST_FOR_LABELS[bestForFilter as BestFor]}</>}
              {search.trim() && <> · &ldquo;<span className="text-stone-700">{search}</span>&rdquo;</>}
            </>
          )}
        </p>
        {anyFilterActive && (
          <button onClick={clearAll} className="text-[11px] font-mono text-stone-400 hover:text-stone-700 transition-colors flex items-center gap-1">
            Clear all <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* ── Content ── */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-stone-400 font-mono text-sm mb-3">No beaches match your filters.</p>
          <button onClick={clearAll} className="text-sm font-mono text-ocean hover:underline">Clear all filters</button>
        </div>
      ) : view === 'map' ? (
        <MapView beaches={filtered} />
      ) : showGrouped && grouped ? (
        <div className="space-y-10">
          {grouped.map(({ region, beaches: group }) => (
            <section key={region}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-display text-xl font-semibold text-stone-700">{REGION_LABELS[region] ?? region}</h2>
                <span className="text-xs font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">{group.length}</span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.map((beach) => <BeachCard key={beach.id} beach={beach} />)}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((beach) => <BeachCard key={beach.id} beach={beach} />)}
        </div>
      )}
    </div>
  )
}
