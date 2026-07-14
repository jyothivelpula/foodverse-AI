export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} aria-hidden />
}

export function MenuSkeletonGrid({ count = 6 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass overflow-hidden rounded-[24px] p-3">
          <Skeleton className="aspect-[4/3] w-full rounded-[18px]" />
          <Skeleton className="mt-4 h-5 w-[75%]" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-1/2" />
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-10 flex-1 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 w-full rounded-[28px]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-[22px]" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-[24px]" />
        <Skeleton className="h-64 rounded-[24px]" />
      </div>
    </div>
  )
}
