"use client"

import { useMemo, useState } from "react"

import { approvePendingCandidate, rejectPendingCandidate } from "@/features/admin/pending/api/pendingCandidates"
import type { PendingCandidate } from "@/features/admin/pending/types"
import { ReleaseCombobox } from "@/features/admin/releases/components/ReleaseCombobox"
import type { Release } from "@/features/releases/types"

type Props = {
  candidates: PendingCandidate[]
  releases: Release[]
  onChanged: () => Promise<void>
  isLoadingGlobal?: boolean
  setGlobalLoading?: (value: boolean) => void
  setStatus?: (msg: string | null) => void
}

export function PendingCandidateList({
  candidates,
  releases,
  onChanged,
  isLoadingGlobal,
  setGlobalLoading,
  setStatus,
}: Props) {
  const pendingCandidates = useMemo(
    () => candidates.filter((candidate) => candidate.status === "PENDING"),
    [candidates],
  )
  const [selectedReleaseIds, setSelectedReleaseIds] = useState<Record<string, string>>({})

  async function handleApprove(candidate: PendingCandidate) {
    const selectedReleaseId = selectedReleaseIds[candidate.id] || candidate.matchedReleaseId || ""
    setStatus?.(null)
    setGlobalLoading?.(true)

    try {
      await approvePendingCandidate(candidate.id, selectedReleaseId ? { releaseId: selectedReleaseId } : {})
      setStatus?.(`✅ pending 후보 승인 완료: ${candidate.artistName} — ${candidate.albumTitle}`)
      await onChanged()
    } catch (error) {
      const msg = error instanceof Error ? error.message : "pending 후보 승인 실패"
      setStatus?.(`❌ ${msg}`)
    } finally {
      setGlobalLoading?.(false)
    }
  }

  async function handleReject(candidate: PendingCandidate) {
    const note = window.prompt("보류/거절 메모를 남길까요?", "") ?? ""
    setStatus?.(null)
    setGlobalLoading?.(true)

    try {
      await rejectPendingCandidate(candidate.id, note || undefined)
      setStatus?.(`📝 pending 후보를 거절 처리했어요: ${candidate.artistName} — ${candidate.albumTitle}`)
      await onChanged()
    } catch (error) {
      const msg = error instanceof Error ? error.message : "pending 후보 거절 실패"
      setStatus?.(`❌ ${msg}`)
    } finally {
      setGlobalLoading?.(false)
    }
  }

  return (
    <section className="space-y-4 rounded-xl border p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">수집 후보 검수</h3>
          <p className="text-xs text-gray-500">크롤러가 수집한 후보를 검수해서 기존 앨범에 연결하거나 새 앨범으로 등록합니다.</p>
        </div>

        <button
          type="button"
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          onClick={() => onChanged()}
          disabled={isLoadingGlobal}
        >
          새로고침
        </button>
      </div>

      {pendingCandidates.length === 0 ? (
        <div className="rounded-lg border p-3 text-sm text-gray-600">검수할 pending 후보가 없습니다.</div>
      ) : (
        <ul className="space-y-3">
          {pendingCandidates.map((candidate) => {
            const releaseSelection = selectedReleaseIds[candidate.id] ?? candidate.matchedReleaseId ?? ""

            return (
              <li key={candidate.id} className="space-y-3 rounded-lg border p-4">
                <div className="space-y-1">
                  <div className="text-sm font-semibold">{candidate.artistName} - {candidate.albumTitle}</div>
                  <div className="text-xs text-gray-500">스토어: {candidate.store.name} ({candidate.store.slug})</div>
                  <div className="text-xs text-gray-500">원본 제목: {candidate.sourceProductTitle}</div>
                  {candidate.matchedReleaseId && (
                    <div className="text-xs font-medium text-emerald-700">
                      기존 앨범 자동 매칭 후보: ID {candidate.matchedReleaseId}
                    </div>
                  )}
                  <a href={candidate.url} target="_blank" rel="noreferrer" className="block truncate text-xs text-blue-600 underline-offset-2 hover:underline">
                    {candidate.url}
                  </a>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-600">기존 앨범에 연결할 경우 선택하세요. 비워두면 새 앨범으로 등록됩니다.</p>
                  <ReleaseCombobox
                    releases={releases}
                    selectedReleaseId={releaseSelection}
                    onSelectReleaseId={(releaseId) => {
                      setSelectedReleaseIds((prev) => ({ ...prev, [candidate.id]: releaseId }))
                    }}
                    disabled={isLoadingGlobal}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700 hover:bg-green-100 disabled:opacity-50"
                    onClick={() => handleApprove(candidate)}
                    disabled={isLoadingGlobal}
                  >
                    {releaseSelection ? "기존 앨범에 연결" : "새 앨범으로 승인"}
                  </button>

                  <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    onClick={() => handleReject(candidate)}
                    disabled={isLoadingGlobal}
                  >
                    거절
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
