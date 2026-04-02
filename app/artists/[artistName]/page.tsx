import { fetchReleaseSummariesByArtistName } from "@/features/releases/api/releases"
import { PaginationNav } from "@/features/releases/components/PaginationNav"
import { ReleaseCard } from "@/features/releases/components/ReleaseCard"

type PageProps = {
  params: Promise<{ artistName: string }>
  searchParams: Promise<{ page?: string }>
}

const PAGE_SIZE = 18

function parsePage(value?: string) {
  const parsed = Number(value ?? "1")
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1
}

export default async function ArtistPage({ params, searchParams }: PageProps) {
  const { artistName } = await params
  const sp = await searchParams

  const paginated = await fetchReleaseSummariesByArtistName(artistName, {
    page: parsePage(sp.page),
    pageSize: PAGE_SIZE,
  })
  const releases = paginated.items

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{artistName}</h1>
        <p className="mt-2 text-sm text-gray-600">등록된 릴리즈</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {releases.map((r) => (
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

      {releases.length === 0 && (
        <p className="text-sm text-gray-600">아직 등록된 릴리즈가 없습니다.</p>
      )}

      <PaginationNav
        pathname={`/artists/${encodeURIComponent(artistName)}`}
        page={paginated.page}
        totalPages={paginated.totalPages}
      />
    </div>
  )
}
