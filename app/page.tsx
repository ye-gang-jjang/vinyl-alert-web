export const revalidate = 60;

import { fetchNewReleases } from "@/lib/api";
import { HomePageClient } from "@/components/releases/HomePageClient";

type SortKey = "default" | "artist_asc" | "album_asc";

function uniqSorted(arr: string[]) {
  return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));
}

type SearchParams = {
  sort?: string;
  artist?: string;
  store?: string;
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  let releases = [];
  try {
    releases = await fetchNewReleases();
  } catch {
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">L Pick</h1>
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
    );
  }

  const selectedSort = (sp.sort as SortKey) || "default";
  const selectedArtist = sp.artist ?? "";
  const selectedStore = sp.store ?? "";

  const artists = uniqSorted(releases.map((r) => r.artistName));

  return (
    <HomePageClient
      releases={releases}
      artists={artists}
      initialSort={selectedSort}
      initialArtist={selectedArtist}
      initialStore={selectedStore}
    />
  );
}
