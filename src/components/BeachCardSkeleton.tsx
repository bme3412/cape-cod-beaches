export function BeachCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 animate-pulse">
      {/* Photo placeholder */}
      <div className="aspect-[4/3] bg-stone-200" />
      {/* Content placeholder */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-stone-200 rounded w-3/4" />
        <div className="h-3 bg-stone-100 rounded w-1/3" />
        <div className="h-3 bg-stone-100 rounded w-1/2" />
        <div className="flex gap-1.5 pt-1">
          <div className="h-4 bg-stone-100 rounded w-16" />
          <div className="h-4 bg-stone-100 rounded w-14" />
          <div className="h-4 bg-stone-100 rounded w-18" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonGrid() {
  return (
    <div>
      {/* Search + sort placeholders */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 h-9 bg-stone-200 rounded-full animate-pulse" />
        <div className="w-40 h-9 bg-stone-200 rounded-full animate-pulse" />
      </div>
      {/* Filter bar placeholder */}
      <div className="flex gap-2 mb-6">
        {[80, 100, 90, 120, 110, 80].map((w, i) => (
          <div key={i} className="h-9 bg-stone-200 rounded-full animate-pulse" style={{ width: w }} />
        ))}
      </div>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <BeachCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
