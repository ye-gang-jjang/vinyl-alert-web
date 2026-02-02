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
  // ✅ Next 버전에 따라 Promise일 수 있어서 Promise로 받는 게 안전
  searchParams: Promise<SearchParams>
}) {
  // ✅ 핵심: await
  const sp = await searchParams

  const releases = await fetchNewReleases()

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
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">New Releases</h1>
        <p className="text-sm text-gray-600">
          최근 수집된 LP 발매/판매 정보 목록입니다.
        </p>
      </header>

      <ReleaseControls
        artists={artists}
        selectedArtist={selectedArtist}
        selectedStore={selectedStore}
        selectedSort={selectedSort}
      />

      {/* ✅ 디버깅용(원인 확인되면 지워도 됨): 현재 적용된 값이 화면에 보임 */}
      <div className="rounded-lg border p-3 text-xs text-gray-600">
        sort={selectedSort} / artist={selectedArtist || "(all)"} / store=
        {selectedStore || "(all)"} / results={filtered.length}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border p-6">
          <p className="text-sm text-gray-600">조건에 맞는 릴리즈가 없습니다.</p>
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
              collectedAgo={r.latestCollectedAgo}
            />
          ))}
        </section>
      )}
    </div>
  )
}
