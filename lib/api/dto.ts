export type ListingStatusDto = "ON_SALE" | "PREORDER" | "SOLD_OUT"

export type ListingDto = {
  id: string
  sourceName: string
  sourceProductTitle: string
  url: string
  imageUrl: string
  collectedAt: string
  latestCollectedAt?: string | null

  // ✅ 추가
  price?: number | null
  status?: ListingStatusDto
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
