"use client"

import { useCallback, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { fetchReleaseSummaries } from "@/features/releases/api/releases"
import ReleaseControls from "@/features/releases/components/ReleaseControls"
import { ReleaseCard } from "@/features/releases/components/ReleaseCard"
import {
  type ReleaseSortKey,
} from "@/features/releases/lib/filtering"
import { useRefreshOnFocus } from "@/shared/hooks/useRefreshOnFocus"
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
  const [releaseItems, setReleaseItems] = useState(releases)
  const [artistOptions, setArtistOptions] = useState(artists)
  const [storeItems, setStoreItems] = useState(stores)
  const [releaseTotal, setReleaseTotal] = useState(total)

  const storeOptions = useMemo(() => storeItems, [storeItems])

  const refreshReleases = useCallback(async () => {
    const data = await fetchReleaseSummaries({
      page,
      pageSize: 18,
      artist: initialArtist || undefined,
      store: initialStore || undefined,
      sort: initialSort,
    })

    setReleaseItems(data.items)
    setArtistOptions(data.artists)
    setStoreItems(data.stores)
    setReleaseTotal(data.total)
  }, [initialArtist, initialSort, initialStore, page])

  useRefreshOnFocus({
    refresh: refreshReleases,
  })

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
        artists={artistOptions}
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
          총 <span className="font-medium text-gray-900">{releaseTotal}</span>개
          릴리즈
        </span>

        {(initialArtist || initialStore || initialSort !== "default") && (
          <span className="text-xs text-gray-500">필터/정렬 적용됨</span>
        )}
      </div>

      {releaseItems.length === 0 ? (
        <div className="space-y-2 rounded-xl border p-6">
          <p className="text-sm font-medium">조건에 맞는 릴리즈가 없습니다.</p>
          <p className="text-sm text-gray-600">
            필터를 초기화하거나 다른 조건으로 다시 검색해보세요.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6 lg:grid-cols-3">
          {releaseItems.map((release) => (
            <ReleaseCard
              key={release.id}
              id={release.id}
              artist={release.artistName}
              album={release.albumTitle}
              coverImageUrl={release.coverImageUrl}
              viewCount={release.viewCount}
              storesCount={release.storesCount}
              latestCollectedAt={release.latestCollectedAt ?? null}
            />
          ))}
        </section>
      )}
    </div>
  )
}
