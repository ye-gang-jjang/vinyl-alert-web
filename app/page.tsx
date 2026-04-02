export const revalidate = 60;

import { HomePageClient } from "@/features/releases/components/HomePageClient";
import { PaginationNav } from "@/features/releases/components/PaginationNav";
import { fetchReleaseSummaries } from "@/features/releases/api/releases";
import type { PaginatedReleaseSummaries } from "@/features/releases/types";

type SortKey = "default" | "artist_asc" | "album_asc";

function uniqSorted(arr: string[]) {
  return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));
}

function parsePage(value?: string) {
  const parsed = Number(value ?? "1");
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

type SearchParams = {
  sort?: string;
  artist?: string;
  store?: string;
  page?: string;
};

const PAGE_SIZE = 18;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  let data: PaginatedReleaseSummaries;
  try {
    data = await fetchReleaseSummaries({
      page: parsePage(sp.page),
      pageSize: PAGE_SIZE,
      artist: sp.artist,
      store: sp.store,
      sort: sp.sort,
    });
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
  const currentPage = data.page;
  const artists = uniqSorted(data.artists);

  return (
    <div className="space-y-6">
      <HomePageClient
        releases={data.items}
        artists={artists}
        stores={data.stores}
        page={currentPage}
        total={data.total}
        initialSort={selectedSort}
        initialArtist={selectedArtist}
        initialStore={selectedStore}
      />

      <PaginationNav
        pathname="/"
        page={currentPage}
        totalPages={data.totalPages}
        params={{
          ...(selectedSort !== "default" ? { sort: selectedSort } : {}),
          ...(selectedArtist ? { artist: selectedArtist } : {}),
          ...(selectedStore ? { store: selectedStore } : {}),
        }}
      />
    </div>
  );
}
