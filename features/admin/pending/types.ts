import type { StoreRef } from "@/features/stores/types"

export type PendingCandidateStatus = "PENDING" | "APPROVED" | "REJECTED"

export const PENDING_CANDIDATE_STATUS_LABELS: Record<PendingCandidateStatus, string> = {
  PENDING: "검수 대기",
  APPROVED: "승인됨",
  REJECTED: "거절됨",
}

export type PendingCandidate = {
  id: string
  artistName: string
  albumTitle: string
  sourceProductTitle: string
  url: string
  price?: number | null
  coverImageUrl?: string | null
  status: PendingCandidateStatus
  createdAt?: string | null
  reviewedAt?: string | null
  matchedReleaseId?: string | null
  store: StoreRef
}
