import type { StoreRef } from "@/features/stores/types"

export type PendingCandidate = {
  id: string
  artistName: string
  albumTitle: string
  sourceProductTitle: string
  url: string
  price?: number | null
  status: "PENDING" | "APPROVED" | "REJECTED"
  note?: string | null
  createdAt?: string | null
  reviewedAt?: string | null
  matchedReleaseId?: string | null
  store: StoreRef
}
