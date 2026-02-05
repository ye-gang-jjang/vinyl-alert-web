export const dynamic = "force-dynamic"
export const revalidate = 0

import { fetchNewReleases } from "@/lib/api"
import { ReleaseCard } from "@/components/releases/ReleaseCard"
import ReleaseControls from "@/components/releases/ReleaseControls"

type SortKey = "default" | "artist_asc" | "album_asc"

function uniqSorted(arr: string[]) {
  return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b))
}

type SearchParams = {
  sort?: string
  artist?: string
  store?: string
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams

  let releases = []
  try {
    releases = await fetchNewReleases()
  } catch {
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">Vinyl Alert</h1>
          <p className="text-sm text-gray-600">
            최근 수집된 LP 판매처 정보를 모아봅니다.
          </p>
        </header>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm text-red-700">
            데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        </div>
      </div>
    )
  }

  const selectedSort = (sp.sort as SortKey) || "default"
  const selectedArtist = sp.artist ?? ""
  const selectedStore = sp.store ?? ""

  const artists = uniqSorted(releases.map((r) => r.artistName))

  // 1) 필터
  let filtered = releases

  if (selectedArtist) {
    filtered = filtered.filter((r) => r.artistName === selectedArtist)
  }

  if (selectedStore) {
    filtered = filtered.filter((r) =>
      r.listings?.some((l) => l.sourceName === selectedStore)
    )
  }

  // 2) 정렬
  if (selectedSort === "artist_asc") {
    filtered = [...filtered].sort((a, b) =>
      a.artistName.localeCompare(b.artistName)
    )
  } else if (selectedSort === "album_asc") {
    filtered = [...filtered].sort((a, b) =>
      a.albumTitle.localeCompare(b.albumTitle)
    )
  }

  return (
    <div className="space-y-6">
      <ReleaseControls
        artists={artists}
        selectedArtist={selectedArtist}
        selectedStore={selectedStore}
        selectedSort={selectedSort}
      />

      {filtered.length === 0 ? (
        <div className="rounded-xl border p-6 space-y-2">
          <p className="text-sm font-medium">조건에 맞는 릴리즈가 없습니다.</p>
          <p className="text-sm text-gray-600">
            필터를 해제하거나 다른 판매처/아티스트로 바꿔보세요.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <ReleaseCard
              key={r.id}
              id={r.id}
              artist={r.artistName}
              album={r.albumTitle}
              coverImageUrl={r.coverImageUrl}
              storesCount={r.storesCount}
              latestCollectedAt={r.latestCollectedAt ?? null}
            />
          ))}
        </section>
      )}
    </div>
  )
}
