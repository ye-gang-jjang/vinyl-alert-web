"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import ReleaseControls from "@/features/releases/components/ReleaseControls"
import { ReleaseCard } from "@/features/releases/components/ReleaseCard"
import {
  buildStoreOptions,
  filterAndSortReleases,
  type ReleaseSortKey,
} from "@/features/releases/lib/filtering"
import type { ReleaseSummary } from "@/features/releases/types"

type Props = {
  releases: ReleaseSummary[]
  artists: string[]
  initialSort: ReleaseSortKey
  initialArtist: string
  initialStore: string
}

export function HomePageClient({
  releases,
  artists,
  initialSort,
  initialArtist,
  initialStore,
}: Props) {
  const pathname = usePathname()
  const [selectedSort, setSelectedSort] = useState<ReleaseSortKey>(initialSort)
  const [selectedArtist, setSelectedArtist] = useState(initialArtist)
  const [selectedStore, setSelectedStore] = useState(initialStore)

  const storeOptions = useMemo(() => buildStoreOptions(releases), [releases])

  useEffect(() => {
    const params = new URLSearchParams()

    if (selectedSort !== "default") {
      params.set("sort", selectedSort)
    }

    if (selectedArtist) {
      params.set("artist", selectedArtist)
    }

    if (selectedStore) {
      params.set("store", selectedStore)
    }

    const nextUrl = params.size > 0 ? `${pathname}?${params.toString()}` : pathname
    if (window.location.pathname + window.location.search !== nextUrl) {
      window.history.replaceState(null, "", nextUrl)
    }
  }, [pathname, selectedArtist, selectedSort, selectedStore])

  const filtered = useMemo(
    () => filterAndSortReleases(releases, selectedArtist, selectedStore, selectedSort),
    [releases, selectedArtist, selectedSort, selectedStore],
  )

  function resetFilters() {
    setSelectedSort("default")
    setSelectedArtist("")
    setSelectedStore("")
  }

  return (
    <div className="space-y-6">
      <ReleaseControls
        artists={artists}
        stores={storeOptions}
        selectedArtist={selectedArtist}
        selectedStore={selectedStore}
        selectedSort={selectedSort}
        onArtistChange={setSelectedArtist}
        onStoreChange={setSelectedStore}
        onSortChange={setSelectedSort}
        onReset={resetFilters}
      />

      <div className="flex min-w-0 flex-col gap-1 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <span className="min-w-0">
          총 <span className="font-medium text-gray-900">{filtered.length}</span>개
          릴리즈
        </span>

        {(selectedArtist || selectedStore || selectedSort !== "default") && (
          <span className="text-xs text-gray-500">필터/정렬 적용됨</span>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="space-y-2 rounded-xl border p-6">
          <p className="text-sm font-medium">조건에 맞는 릴리즈가 없습니다.</p>
          <p className="text-sm text-gray-600">
            필터를 초기화하거나 다른 조건으로 다시 검색해보세요.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((release) => (
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
