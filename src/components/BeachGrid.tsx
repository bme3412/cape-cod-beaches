'use client'

import { useState, useMemo } from 'react'
import BeachCard from './BeachCard'
import FilterBar from './FilterBar'
import type { BeachWithData, FilterType, BeachType } from '@/types/beach'

interface Props {
  beaches: BeachWithData[]
}

export default function BeachGrid({ beaches }: Props) {
  const [filter, setFilter] = useState<FilterType>('all')

  const counts = useMemo(() => {
    const c: Record<FilterType, number> = {
      all: beaches.length,
      ocean: 0,
      bay: 0,
      dunes: 0,
      national_seashore: 0,
      harbor: 0,
    }
    for (const b of beaches) {
      if (b.beach_type in c) c[b.beach_type as BeachType]++
    }
    return c
  }, [beaches])

  const filtered = useMemo(
    () => (filter === 'all' ? beaches : beaches.filter((b) => b.beach_type === filter)),
    [beaches, filter]
  )

  return (
    <div>
      <div className="mb-6">
        <FilterBar active={filter} onChange={setFilter} counts={counts} />
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-stone-400 font-mono">
          No beaches found for this filter.
        </div>
      ) : (
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
