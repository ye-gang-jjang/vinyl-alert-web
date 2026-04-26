"use client"

import Link from "next/link"
import { useCallback, useState } from "react"

import { fetchReleaseById } from "@/features/releases/api/releases"
import { ReleaseHeader } from "@/features/releases/components/ReleaseHeader"
import { StoreItem } from "@/features/releases/components/StoreItem"
import type { Release } from "@/features/releases/types"
import { useRefreshOnFocus } from "@/shared/hooks/useRefreshOnFocus"

type Props = {
  initialRelease: Release | null
  releaseId: string
}

export function ReleasePageClient({ initialRelease, releaseId }: Props) {
  const [release, setRelease] = useState(initialRelease)

  const refreshRelease = useCallback(async () => {
    const nextRelease = await fetchReleaseById(releaseId)
    setRelease(nextRelease)
  }, [releaseId])

  useRefreshOnFocus({
    enabled: Boolean(releaseId),
    refresh: refreshRelease,
  })

  if (!release) {
    return (
      <div className="space-y-4">
        <Link href="/" className="text-sm text-gray-600 hover:underline">
          ← Home
        </Link>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Release not found</h1>
          <p className="text-sm text-gray-600">존재하지 않는 Release입니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link href="/" className="text-sm text-gray-600 hover:underline">
        ← Home
      </Link>

      <ReleaseHeader
        releaseId={release.id}
        artistName={release.artistName}
        albumTitle={release.albumTitle}
        viewCount={release.viewCount}
        storesCount={release.storesCount}
        coverImageUrl={release.coverImageUrl}
        latestCollectedAt={release.latestCollectedAt}
      />

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">판매처</h2>
          <div className="text-xs text-gray-500">{release.listings.length}개</div>
        </div>

        {release.listings.length === 0 ? (
          <div className="rounded-xl border p-6">
            <p className="text-sm font-medium">등록된 판매처가 없습니다.</p>
            <p className="mt-1 text-sm text-gray-600">관리자 페이지에서 판매처를 추가해 주세요.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {release.listings.map((listing) => (
              <li key={listing.id}>
                <StoreItem
                  name={listing.sourceName}
                  title={listing.sourceProductTitle}
                  url={listing.url}
                  imageUrl={listing.imageUrl}
                  collectedAt={listing.collectedAt}
                  price={listing.price}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
