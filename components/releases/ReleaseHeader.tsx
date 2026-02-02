import { formatCollectedAgo } from "@/lib/formatters/formatCollectedAgo"

type ReleaseHeaderProps = {
  artistName: string
  albumTitle: string
  storesCount: number
  coverImageUrl?: string
  collectedAt?: string | null
  latestCollectedAt?: string | null
}

export function ReleaseHeader({
  artistName,
  albumTitle,
  storesCount,
  coverImageUrl,
  collectedAt,
  latestCollectedAt,
}: ReleaseHeaderProps) {
  const collectedText = formatCollectedAgo({ latestCollectedAt, collectedAt })

  return (
    <header className="space-y-3">
      <h1 className="text-2xl font-bold">
        {artistName} — {albumTitle}
      </h1>

      <div className="text-sm text-gray-600">
        {`판매처 ${storesCount}개 · 최근 수집: ${collectedText}`}
      </div>

      {/* 커버 이미지 */}
      <div className="mt-4 h-56 w-56 overflow-hidden rounded-xl border bg-white">
        {coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImageUrl}
            alt={`${artistName} - ${albumTitle} cover`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            No Image
          </div>
        )}
      </div>
    </header>
  )
}
