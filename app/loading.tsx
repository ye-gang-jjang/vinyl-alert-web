function HomeCardSkeleton() {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex gap-4">
        <div className="h-20 w-20 shrink-0 animate-pulse rounded-lg border bg-gray-100" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
          <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100" />
          <div className="space-y-1 pt-1">
            <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-32 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="h-9 w-32 animate-pulse rounded-md bg-gray-100" />
          <div className="h-9 w-[220px] animate-pulse rounded-md bg-gray-100" />
          <div className="h-9 w-[220px] animate-pulse rounded-md bg-gray-100" />
        </div>
        <div className="h-9 w-24 animate-pulse rounded-md bg-gray-100" />
      </div>

      <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <HomeCardSkeleton key={index} />
        ))}
      </section>
    </div>
  )
}
