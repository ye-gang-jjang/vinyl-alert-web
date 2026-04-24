import type { Listing } from "@/features/listings/types"
import type { StoreRef } from "@/features/stores/types"

export type Release = {
  id: string
  artistName: string
  albumTitle: string
  coverImageUrl?: string
  viewCount: number
  storesCount: number
  listings: Listing[]
  collectedAt?: string | null
  latestCollectedAt?: string | null
}

export type ReleaseSummary = {
  id: string
  artistName: string
  albumTitle: string
  coverImageUrl?: string
  viewCount: number
  storesCount: number
  stores: StoreRef[]
  collectedAt?: string | null
  latestCollectedAt?: string | null
}

export type PaginatedReleaseSummaries = {
  items: ReleaseSummary[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  artists: string[]
  stores: StoreRef[]
}
