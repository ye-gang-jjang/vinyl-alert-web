export type Listing = {
  id: string
  sourceName: string
  sourceProductTitle: string
  url: string
  collectedAgo: string
  imageUrl?: string
}

export type Release = {
  id: string
  artistName: string
  albumTitle: string
  coverImageUrl?: string

  latestCollectedAgo: string
  storesCount: number

  listings: Listing[]
}
