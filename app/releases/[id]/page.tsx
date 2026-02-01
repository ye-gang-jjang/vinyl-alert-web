import { fetchReleaseById } from "@/lib/api";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReleasePage({ params }: PageProps) {
  const { id } = await params;
  const release = await fetchReleaseById(id);

  if (!release) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Release not found</h1>
        <p className="text-sm text-gray-600">존재하지 않는 Release입니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 상단: Release 정보 */}
      <header className="space-y-3">
        <h1 className="text-2xl font-bold">
          {release.artistName} — {release.albumTitle}
        </h1>

        <div className="text-sm text-gray-600">
          {release.color ? `컬러: ${release.color}` : "컬러: -"}
          {release.format ? ` · 포맷: ${release.format}` : ""}
          {` · 판매처 ${release.storesCount}개`}
          {` · 최근 수집: ${release.latestCollectedAgo}`}
        </div>

        {/* 커버 이미지 */}
        <div className="mt-4 h-56 w-56 overflow-hidden rounded-xl border bg-white">
          {release.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={release.coverImageUrl}
              alt={`${release.artistName} - ${release.albumTitle} cover`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              No Image
            </div>
          )}
        </div>
      </header>

      {/* 하단: Listing 리스트 */}
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
              <li key={l.id} className="rounded-xl border p-4">
                <div className="flex gap-4">
                  {/* Listing 이미지 */}
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-white">
                    {l.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={l.imageUrl}
                        alt={`${l.sourceName} icon`}
                        className="h-full w-full object-contain p-2"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        -
                      </div>
                    )}
                  </div>

                  {/* Listing 텍스트 */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium">{l.sourceName}</div>

                      <a
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-red-600 hover:underline"
                      >
                        판매처로 이동
                      </a>
                    </div>

                    <div className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {l.sourceProductTitle}
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      수집: {l.collectedAgo}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
