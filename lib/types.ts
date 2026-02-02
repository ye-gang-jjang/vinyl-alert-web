export type Listing = {
  id: string
  sourceName: string
  sourceProductTitle: string
  url: string
  imageUrl: string
  collectedAt: string
  latestCollectedAt?: string | null
}

export type Release = {
  id: string
  artistName: string
  albumTitle: string
  coverImageUrl?: string
  collectedAt?: string | null
  latestCollectedAt?: string | null
  storesCount: number
  listings: Listing[]
}
