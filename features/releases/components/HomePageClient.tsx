"use client"

import { useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import ReleaseControls from "@/features/releases/components/ReleaseControls"
import { ReleaseCard } from "@/features/releases/components/ReleaseCard"
import {
  type ReleaseSortKey,
} from "@/features/releases/lib/filtering"
import type { ReleaseSummary } from "@/features/releases/types"
import type { StoreRef } from "@/features/stores/types"

type Props = {
  releases: ReleaseSummary[]
  artists: string[]
  stores: StoreRef[]
  page: number
  total: number
  initialSort: ReleaseSortKey
  initialArtist: string
  initialStore: string
}

export function HomePageClient({
  releases,
  artists,
  stores,
  page,
  total,
  initialSort,
  initialArtist,
  initialStore,
}: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const storeOptions = useMemo(() => stores, [stores])

  function updateFilters(next: {
    sort?: ReleaseSortKey
    artist?: string
    store?: string
    page?: number
  }) {
    const params = new URLSearchParams()

    const sort = next.sort ?? initialSort
    const artist = next.artist ?? initialArtist
    const store = next.store ?? initialStore
    const targetPage = next.page ?? page

    if (sort !== "default") {
      params.set("sort", sort)
    }

    if (artist) {
      params.set("artist", artist)
    }

    if (store) {
      params.set("store", store)
    }

    if (targetPage > 1) {
      params.set("page", String(targetPage))
    }

    const nextUrl = params.size > 0 ? `${pathname}?${params.toString()}` : pathname
    router.replace(nextUrl)
  }

  function resetFilters() {
    updateFilters({ sort: "default", artist: "", store: "", page: 1 })
  }

  return (
    <div className="space-y-6">
      <ReleaseControls
        artists={artists}
        stores={storeOptions}
        selectedArtist={initialArtist}
        selectedStore={initialStore}
        selectedSort={initialSort}
        onArtistChange={(value) => updateFilters({ artist: value, page: 1 })}
        onStoreChange={(value) => updateFilters({ store: value, page: 1 })}
        onSortChange={(value) => updateFilters({ sort: value, page: 1 })}
        onReset={resetFilters}
      />

      <div className="flex min-w-0 flex-col gap-1 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <span className="min-w-0">
          총 <span className="font-medium text-gray-900">{total}</span>개
          릴리즈
        </span>

        {(initialArtist || initialStore || initialSort !== "default") && (
          <span className="text-xs text-gray-500">필터/정렬 적용됨</span>
        )}
      </div>

      {releases.length === 0 ? (
        <div className="space-y-2 rounded-xl border p-6">
          <p className="text-sm font-medium">조건에 맞는 릴리즈가 없습니다.</p>
          <p className="text-sm text-gray-600">
            필터를 초기화하거나 다른 조건으로 다시 검색해보세요.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {releases.map((release) => (
            <ReleaseCard
              key={release.id}
              id={release.id}
              artist={release.artistName}
              album={release.albumTitle}
              coverImageUrl={release.coverImageUrl}
              storesCount={release.storesCount}
              latestCollectedAt={release.latestCollectedAt ?? null}
            />
          ))}
        </section>
      )}
    </div>
  )
}
