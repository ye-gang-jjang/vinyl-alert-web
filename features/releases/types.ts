import type { Listing } from "@/features/listings/types"
import type { StoreRef } from "@/features/stores/types"

export type Release = {
  id: string
  artistName: string
  albumTitle: string
  coverImageUrl?: string
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
  storesCount: number
  stores: StoreRef[]
  collectedAt?: string | null
  latestCollectedAt?: string | null
}
