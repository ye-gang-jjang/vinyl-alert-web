export type StoreRef = {
  slug: string
  name: string
  iconUrl: string
}

export type Store = StoreRef & {
  id: string
  listingsCount: number
}
