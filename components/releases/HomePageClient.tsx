"use client"

import { useMemo, useState } from "react"
import ReleaseControls, { type SortKey } from "@/components/releases/ReleaseControls"
import { ReleaseCard } from "@/components/releases/ReleaseCard"
import type { ReleaseSummary } from "@/lib/types"

type Props = {
  releases: ReleaseSummary[]
  artists: string[]
  initialSort: SortKey
  initialArtist: string
  initialStore: string
}

function getTime(iso?: string | null) {
  return iso ? Date.parse(iso) : 0
}

export function HomePageClient({
  releases,
  artists,
  initialSort,
  initialArtist,
  initialStore,
}: Props) {
  const [selectedSort, setSelectedSort] = useState<SortKey>(initialSort)
  const [selectedArtist, setSelectedArtist] = useState(initialArtist)
  const [selectedStore, setSelectedStore] = useState(initialStore)

  const filtered = useMemo(() => {
    let next = releases

    if (selectedArtist) {
      next = next.filter((release) => release.artistName === selectedArtist)
    }

    if (selectedStore) {
      next = next.filter((release) => release.storeNames.includes(selectedStore))
    }

    if (selectedSort === "artist_asc") {
      return [...next].sort((a, b) => a.artistName.localeCompare(b.artistName))
    }

    if (selectedSort === "album_asc") {
      return [...next].sort((a, b) => a.albumTitle.localeCompare(b.albumTitle))
    }

    return [...next].sort((a, b) => {
      const timeA = getTime(a.latestCollectedAt ?? null)
      const timeB = getTime(b.latestCollectedAt ?? null)
      return timeB - timeA
    })
  }, [releases, selectedArtist, selectedSort, selectedStore])

  function resetFilters() {
    setSelectedSort("default")
    setSelectedArtist("")
    setSelectedStore("")
  }

  return (
    <div className="space-y-6">
      <ReleaseControls
        artists={artists}
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
