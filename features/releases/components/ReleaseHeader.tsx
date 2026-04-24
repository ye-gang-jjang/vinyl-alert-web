import Image from "next/image"

import { ReleaseViewCount } from "@/features/releases/components/ReleaseViewCount"
import { formatCollectedAgo } from "@/shared/lib/formatters/formatCollectedAgo"

type ReleaseHeaderProps = {
  releaseId: string
  artistName: string
  albumTitle: string
  viewCount: number
  storesCount: number
  coverImageUrl?: string
  latestCollectedAt?: string | null
}

export function ReleaseHeader({
  releaseId,
  artistName,
  albumTitle,
  viewCount,
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

        <ReleaseViewCount
          releaseId={releaseId}
          initialViewCount={viewCount}
          storesCount={storesCount}
          collectedText={collectedText}
        />
      </div>

      {/* Cover image */}
      <div className="w-full">
        <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-xl border bg-white sm:max-w-[320px]">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={`${artistName} - ${albumTitle} cover`}
              fill
              priority
              unoptimized
              sizes="(max-width: 640px) 280px, 320px"
              className="h-full w-full object-cover"
              quality={75}
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
