import { fetchReleaseById } from "@/lib/api"
import { ReleaseHeader } from "@/components/releases/ReleaseHeader"
import { StoreItem } from "@/components/releases/StoreItem"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function ReleasePage({ params }: PageProps) {
  const { id } = await params
  const release = await fetchReleaseById(id)

  if (!release) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Release not found</h1>
        <p className="text-sm text-gray-600">존재하지 않는 Release입니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <ReleaseHeader
        artistName={release.artistName}
        albumTitle={release.albumTitle}
        storesCount={release.storesCount}
        coverImageUrl={release.coverImageUrl}
        latestCollectedAt={release.latestCollectedAt}
        collectedAt={release.collectedAt}
      />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">판매처</h2>

        {release.listings.length === 0 ? (
          <div className="rounded-xl border p-6">
            <p className="text-sm text-gray-600">
              아직 등록된 판매처가 없습니다. 관리자 페이지에서 판매처를 추가해
              주세요.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {release.listings.map((l) => (
              <li key={l.id}>
                <StoreItem
                  name={l.sourceName}
                  title={l.sourceProductTitle}
                  url={l.url}
                  latestCollectedAt={l.latestCollectedAt}
                  collectedAt={l.collectedAt}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
