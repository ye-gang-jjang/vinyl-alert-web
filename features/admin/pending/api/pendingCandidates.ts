import type { PendingCandidate } from "@/features/admin/pending/types"
import { apiUrl } from "@/shared/api/client"

export type ApprovePendingCandidatePayload = {
  releaseId?: string
  artistName?: string
  albumTitle?: string
  coverImageUrl?: string
  price?: number | null
}

export async function fetchPendingCandidates(): Promise<PendingCandidate[]> {
  const res = await fetch(apiUrl("/pending-candidates"), { cache: "no-store" })
  if (!res.ok) {
    throw new Error("Failed to fetch pending candidates")
  }
  return res.json()
}

export async function approvePendingCandidate(
  candidateId: string,
  payload: ApprovePendingCandidatePayload,
) {
  const res = await fetch(apiUrl(`/pending-candidates/${candidateId}/approve`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`승인 실패 (${res.status})${body ? `: ${body}` : ""}`)
  }
  return res.json()
}

export async function rejectPendingCandidate(candidateId: string, note?: string) {
  const res = await fetch(apiUrl(`/pending-candidates/${candidateId}/reject`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`보류 실패 (${res.status})${body ? `: ${body}` : ""}`)
  }
  return res.json()
}
