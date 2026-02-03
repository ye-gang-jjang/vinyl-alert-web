export type ListingDto = {
  id: string
  sourceName: string
  sourceProductTitle: string
  url: string
  imageUrl: string
  collectedAt: string
  latestCollectedAt?: string | null
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
