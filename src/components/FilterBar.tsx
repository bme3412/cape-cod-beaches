'use client'

import type { FilterType, BeachType } from '@/types/beach'
import { BEACH_TYPE_LABELS, BEACH_TYPE_DOT } from '@/lib/utils'

interface Props {
  active: FilterType
  onChange: (filter: FilterType) => void
  counts: Record<FilterType, number>
}

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'ocean_surf', label: BEACH_TYPE_LABELS.ocean_surf },
  { value: 'bay_calm', label: BEACH_TYPE_LABELS.bay_calm },
  { value: 'sound', label: BEACH_TYPE_LABELS.sound },
  { value: 'national_seashore', label: BEACH_TYPE_LABELS.national_seashore },
  { value: 'dunes', label: BEACH_TYPE_LABELS.dunes },
  { value: 'harbor', label: BEACH_TYPE_LABELS.harbor },
]

export default function FilterBar({ active, onChange, counts }: Props) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
      {FILTERS.map(({ value, label }) => {
        const count = counts[value] ?? 0
        if (value !== 'all' && count === 0) return null

        const isActive = active === value
        const dot = value !== 'all' ? BEACH_TYPE_DOT[value as BeachType] : null

        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-150 ${
              isActive
                ? 'bg-stone-800 text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400 hover:text-stone-800'
            }`}
          >
            {dot && (
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-white/60' : dot}`} />
            )}
            {label}
            <span className={`text-[10px] tabular-nums ${isActive ? 'text-white/70' : 'text-stone-400'}`}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
