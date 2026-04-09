export type Listing = {
  id: string
  sourceName: string
  sourceProductTitle: string
  url: string
  imageUrl: string
  collectedAt: string
  latestCollectedAt?: string | null
  price?: number | null
}
