import type { ReleaseSummary } from "@/features/releases/types"
import type { StoreRef } from "@/features/stores/types"

export type ReleaseSortKey = "default" | "artist_asc" | "album_asc"

function getTime(iso?: string | null) {
  return iso ? Date.parse(iso) : 0
}

export function buildStoreOptions(releases: ReleaseSummary[]): StoreRef[] {
  const deduped = new Map<string, StoreRef>()

  releases.forEach((release) => {
    release.stores.forEach((store) => {
      if (!deduped.has(store.slug)) {
        deduped.set(store.slug, store)
      }
    })
  })

  return Array.from(deduped.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export function filterAndSortReleases(
  releases: ReleaseSummary[],
  selectedArtist: string,
  selectedStore: string,
  selectedSort: ReleaseSortKey,
) {
  let next = releases

  if (selectedArtist) {
    next = next.filter((release) => release.artistName === selectedArtist)
  }

  if (selectedStore) {
    next = next.filter((release) => release.stores.some((store) => store.slug === selectedStore))
  }

  if (selectedSort === "artist_asc") {
    return [...next].sort((a, b) => a.artistName.localeCompare(b.artistName))
  }

  if (selectedSort === "album_asc") {
    return [...next].sort((a, b) => a.albumTitle.localeCompare(b.albumTitle))
  }

  return [...next].sort((a, b) => getTime(b.latestCollectedAt ?? null) - getTime(a.latestCollectedAt ?? null))
}
