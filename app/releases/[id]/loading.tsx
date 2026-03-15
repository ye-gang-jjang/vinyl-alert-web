export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />

      <header className="space-y-4">
        <div className="space-y-2">
          <div className="h-8 w-2/3 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="mx-auto aspect-square w-full max-w-[280px] animate-pulse rounded-xl border bg-gray-100 sm:max-w-[320px]" />
      </header>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div className="h-6 w-16 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-10 animate-pulse rounded bg-gray-100" />
        </div>

        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl border p-4">
            <div className="flex gap-4">
              <div className="h-14 w-14 shrink-0 animate-pulse rounded-lg border bg-gray-100" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-28 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
