import type { ListingStatus } from "@/features/listings/types"
import type { StoreRef } from "@/features/stores/types"

export type ListingDto = {
  id: string
  sourceName: string
  sourceProductTitle: string
  url: string
  imageUrl: string
  collectedAt: string
  latestCollectedAt?: string | null
  price?: number | null
  status?: ListingStatus
}

export type ReleaseDto = {
  id: string
  artistName: string
  albumTitle: string
  coverImageUrl?: string
  storesCount: number
  listings: ListingDto[]
  collectedAt?: string | null
  latestCollectedAt?: string | null
}

export type ReleaseSummaryDto = {
  id: string
  artistName: string
  albumTitle: string
  coverImageUrl?: string
  storesCount: number
  stores: StoreRef[]
  collectedAt?: string | null
  latestCollectedAt?: string | null
}

export type PaginatedReleaseSummariesDto = {
  items: ReleaseSummaryDto[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  artists: string[]
  stores: StoreRef[]
}
