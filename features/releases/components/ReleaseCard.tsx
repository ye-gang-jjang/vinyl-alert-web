import { Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { formatCollectedAgo } from "@/shared/lib/formatters/formatCollectedAgo"

type ReleaseCardProps = {
  id: string
  artist: string
  album: string
  coverImageUrl?: string
  viewCount: number
  storesCount: number
  latestCollectedAt?: string | null
}

export function ReleaseCard({
  id,
  artist,
  album,
  coverImageUrl,
  viewCount,
  storesCount,
  latestCollectedAt,
}: ReleaseCardProps) {
  const collectedText = formatCollectedAgo({
    latestCollectedAt,
  })

  return (
    <Link
      href={`/releases/${id}`}
      prefetch={false}
      className="
        block rounded-xl border bg-white
        transition-all
        hover:bg-gray-50 hover:shadow-sm
        active:scale-[0.98] active:bg-gray-100
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300
      "
    >
      <div className="flex min-h-[7.5rem] gap-4 p-5">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-white">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={`${artist} - ${album} cover`}
              fill
              unoptimized
              sizes="96px"
              className="h-full w-full object-cover"
              quality={85}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 truncate text-sm font-medium text-gray-700">{artist}</div>

            <div
              className="inline-flex shrink-0 items-center gap-1.5 text-sm text-gray-500"
              aria-label={`조회수 ${viewCount}`}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              <span>{viewCount}</span>
            </div>
          </div>

          <div className="mt-1 truncate text-lg font-semibold leading-7">
            {album}
          </div>

          <div className="mt-1.5 space-y-0.5 text-sm text-gray-500">
            <div>판매처 {storesCount}</div>
            <div>최근 업데이트: {collectedText}</div>
          </div>
        </div>
      </div>
    </Link>
  )
}
