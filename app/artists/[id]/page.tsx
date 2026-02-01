import { ReleaseCard } from "@/components/releases/ReleaseCard"
import { fetchReleasesByArtistName } from "@/lib/api"

type PageProps = {
  params: Promise<{ id: string }>
}

const artistIdToName: Record<string, string> = {
  "1": "IU",
  "2": "BTS",
}

export default async function ArtistPage({ params }: PageProps) {
  const { id } = await params

  const artistName = artistIdToName[id] ?? `Artist #${id}`
  const releases = await fetchReleasesByArtistName(artistName)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{artistName}</h1>
        <p className="mt-2 text-sm text-gray-600">등록된 릴리즈</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {releases.map((r) => (
          <ReleaseCard
            key={r.id}
            id={r.id}
            artist={r.artistName}
            album={r.albumTitle}
            color={r.color}
            format={r.format}
            storesCount={r.storesCount}
            collectedAgo={r.latestCollectedAgo}
          />
        ))}
      </section>

      {releases.length === 0 && (
        <p className="text-sm text-gray-600">아직 등록된 릴리즈가 없습니다.</p>
      )}
    </div>
  )
}
