import type { PendingCandidate, PendingCandidateStatus } from "@/features/admin/pending/types"
import { apiUrl } from "@/shared/api/client"

export type ApprovePendingCandidatePayload = {
  releaseId?: string
  artistName?: string
  albumTitle?: string
  coverImageUrl?: string
  price?: number | null
}

export type FetchPendingCandidatesParams = {
  status?: PendingCandidateStatus | "ALL"
  storeSlug?: string
  query?: string
}

export async function fetchPendingCandidates(params: FetchPendingCandidatesParams = {}): Promise<PendingCandidate[]> {
  const searchParams = new URLSearchParams()
  if (params.status && params.status !== "ALL") {
    searchParams.set("status", params.status)
  }
  if (params.storeSlug && params.storeSlug !== "ALL") {
    searchParams.set("storeSlug", params.storeSlug)
  }
  if (params.query?.trim()) {
    searchParams.set("q", params.query.trim())
  }

  const queryString = searchParams.toString()
  const path = queryString ? `/pending-candidates?${queryString}` : "/pending-candidates"
  const res = await fetch(apiUrl(path), { cache: "no-store" })
  if (!res.ok) {
    throw new Error("Failed to fetch pending candidates")
  }
  return res.json()
}

export async function bulkRejectPendingCandidates(candidateIds: string[]) {
  const res = await fetch(apiUrl("/pending-candidates/bulk/reject"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ candidateIds }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`일괄 거절 실패 (${res.status})${body ? `: ${body}` : ""}`)
  }
  return res.json()
}

export async function bulkApprovePendingCandidates(items: Array<{ candidateId: string; releaseId?: string }>) {
  const res = await fetch(apiUrl("/pending-candidates/bulk/approve"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`일괄 승인 실패 (${res.status})${body ? `: ${body}` : ""}`)
  }
  return res.json()
}

export async function reopenPendingCandidate(candidateId: string) {
  const res = await fetch(apiUrl(`/pending-candidates/${candidateId}/reopen`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`다시 검토 실패 (${res.status})${body ? `: ${body}` : ""}`)
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

export async function rejectPendingCandidate(candidateId: string) {
  const res = await fetch(apiUrl(`/pending-candidates/${candidateId}/reject`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`보류 실패 (${res.status})${body ? `: ${body}` : ""}`)
  }
  return res.json()
}
