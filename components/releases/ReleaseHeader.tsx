import { formatCollectedAgo } from "@/lib/formatters/formatCollectedAgo"

type ReleaseHeaderProps = {
  artistName: string
  albumTitle: string
  storesCount: number
  coverImageUrl?: string
  latestCollectedAt?: string | null
}

export function ReleaseHeader({
  artistName,
  albumTitle,
  storesCount,
  coverImageUrl,
  latestCollectedAt,
}: ReleaseHeaderProps) {
  const collectedText = formatCollectedAgo({ latestCollectedAt })

  return (
    <header className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          {artistName} — {albumTitle}
        </h1>

        <div className="text-sm text-gray-600">
          판매처 {storesCount}개 · 최근 수집: {collectedText}
        </div>
      </div>

      {/* Cover image */}
      <div className="w-full">
        <div className="mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-xl border bg-white sm:max-w-[320px]">
          {coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImageUrl}
              alt={`${artistName} - ${albumTitle} cover`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              No Image
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
