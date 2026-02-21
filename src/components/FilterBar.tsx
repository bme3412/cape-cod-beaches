'use client'

import type { FilterType } from '@/types/beach'
import { BEACH_TYPE_LABELS } from '@/lib/utils'

interface Props {
  active: FilterType
  onChange: (filter: FilterType) => void
  counts: Record<FilterType, number>
}

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All Beaches' },
  { value: 'ocean', label: BEACH_TYPE_LABELS.ocean },
  { value: 'bay', label: BEACH_TYPE_LABELS.bay },
  { value: 'dunes', label: BEACH_TYPE_LABELS.dunes },
  { value: 'national_seashore', label: BEACH_TYPE_LABELS.national_seashore },
  { value: 'harbor', label: BEACH_TYPE_LABELS.harbor },
]

export default function FilterBar({ active, onChange, counts }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      {FILTERS.map(({ value, label }) => {
        const count = counts[value] ?? 0
        if (value !== 'all' && count === 0) return null

        const isActive = active === value
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-mono transition-all duration-200 ${
              isActive
                ? 'bg-ocean text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-ocean/50 hover:text-ocean'
            }`}
          >
            {label}
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
              }`}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
