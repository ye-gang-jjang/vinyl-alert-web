export default function Loading() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-xl border bg-white p-4">
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
        ))}
      </section>
    </div>
  )
}
