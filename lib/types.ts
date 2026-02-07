export type ListingStatus = "ON_SALE" | "PREORDER" | "SOLD_OUT"

export type Listing = {
  id: string
  sourceName: string
  sourceProductTitle: string
  url: string
  imageUrl: string
  collectedAt: string
  latestCollectedAt?: string | null

  // ✅ 추가
  price?: number | null
  status?: ListingStatus
}

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
