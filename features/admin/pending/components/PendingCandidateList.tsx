"use client"

import Image from "next/image"
import { useMemo, useState } from "react"

import {
  approvePendingCandidate,
  bulkApprovePendingCandidates,
  bulkRejectPendingCandidates,
  rejectPendingCandidate,
} from "@/features/admin/pending/api/pendingCandidates"
import {
  PENDING_CANDIDATE_STATUS_LABELS,
  type PendingCandidate,
  type PendingCandidateStatus,
} from "@/features/admin/pending/types"
import { ReleaseCombobox } from "@/features/admin/releases/components/ReleaseCombobox"
import type { Release } from "@/features/releases/types"
import type { Store } from "@/features/stores/types"

type Props = {
  candidates: PendingCandidate[]
  releases: Release[]
  stores: Store[]
  onChanged: () => Promise<void>
  isLoadingGlobal?: boolean
  setGlobalLoading?: (value: boolean) => void
  setStatus?: (msg: string | null) => void
}

const STATUS_FILTER_OPTIONS: Array<{ value: PendingCandidateStatus | "ALL"; label: string }> = [
  { value: "PENDING", label: "검수 대기" },
  { value: "APPROVED", label: "승인됨" },
  { value: "REJECTED", label: "거절됨" },
  { value: "ALL", label: "전체 상태" },
]

export function PendingCandidateList({
  candidates,
  releases,
  stores,
  onChanged,
  isLoadingGlobal,
  setGlobalLoading,
  setStatus,
}: Props) {
  const [selectedReleaseIds, setSelectedReleaseIds] = useState<Record<string, string>>({})
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Record<string, boolean>>({})
  const [statusFilter, setStatusFilter] = useState<PendingCandidateStatus | "ALL">("PENDING")
  const [storeFilter, setStoreFilter] = useState("ALL")
  const [searchTerm, setSearchTerm] = useState("")

  const countsByStatus = useMemo(() => {
    return candidates.reduce<Record<PendingCandidateStatus, number>>(
      (acc, candidate) => {
        acc[candidate.status] += 1
        return acc
      },
      { PENDING: 0, APPROVED: 0, REJECTED: 0 },
    )
  }, [candidates])

  const countsByStore = useMemo(() => {
    return candidates.reduce<Record<string, number>>((acc, candidate) => {
      acc[candidate.store.slug] = (acc[candidate.store.slug] ?? 0) + 1
      return acc
    }, {})
  }, [candidates])

  const filteredCandidates = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()

    return candidates.filter((candidate) => {
      if (statusFilter !== "ALL" && candidate.status !== statusFilter) {
        return false
      }
      if (storeFilter !== "ALL" && candidate.store.slug !== storeFilter) {
        return false
      }
      if (!keyword) {
        return true
      }

      const haystacks = [candidate.artistName, candidate.albumTitle, candidate.sourceProductTitle]
      return haystacks.some((value) => value.toLowerCase().includes(keyword))
    })
  }, [candidates, searchTerm, statusFilter, storeFilter])

  const visiblePendingCandidates = useMemo(
    () => filteredCandidates.filter((candidate) => candidate.status === "PENDING"),
    [filteredCandidates],
  )

  const selectedVisiblePendingIds = visiblePendingCandidates
    .filter((candidate) => selectedCandidateIds[candidate.id])
    .map((candidate) => candidate.id)

  const allVisiblePendingSelected =
    visiblePendingCandidates.length > 0 && selectedVisiblePendingIds.length === visiblePendingCandidates.length

  function toggleCandidateSelection(candidateId: string, checked: boolean) {
    setSelectedCandidateIds((prev) => ({ ...prev, [candidateId]: checked }))
  }

  function toggleSelectAllVisible(checked: boolean) {
    setSelectedCandidateIds((prev) => {
      const next = { ...prev }
      for (const candidate of visiblePendingCandidates) {
        next[candidate.id] = checked
      }
      return next
    })
  }

  async function handleApprove(candidate: PendingCandidate) {
    const selectedReleaseId = selectedReleaseIds[candidate.id] || candidate.matchedReleaseId || ""
    setStatus?.(null)
    setGlobalLoading?.(true)

    try {
      await approvePendingCandidate(candidate.id, selectedReleaseId ? { releaseId: selectedReleaseId } : {})
      setStatus?.(`승인 완료: ${candidate.artistName} - ${candidate.albumTitle}`)
      await onChanged()
    } catch (error) {
      const msg = error instanceof Error ? error.message : "pending 후보 승인 실패"
      setStatus?.(`오류: ${msg}`)
    } finally {
      setGlobalLoading?.(false)
    }
  }

  async function handleReject(candidate: PendingCandidate) {
    const note = window.prompt("거절 메모를 남길까요?", "") ?? ""
    setStatus?.(null)
    setGlobalLoading?.(true)

    try {
      await rejectPendingCandidate(candidate.id, note || undefined)
      setSelectedCandidateIds((prev) => ({ ...prev, [candidate.id]: false }))
      setStatus?.(`거절 처리: ${candidate.artistName} - ${candidate.albumTitle}`)
      await onChanged()
    } catch (error) {
      const msg = error instanceof Error ? error.message : "pending 후보 거절 실패"
      setStatus?.(`오류: ${msg}`)
    } finally {
      setGlobalLoading?.(false)
    }
  }

  async function handleBulkReject() {
    if (selectedVisiblePendingIds.length === 0) {
      return
    }

    const note = window.prompt("선택 항목에 공통 거절 메모를 남길까요?", "") ?? ""
    setStatus?.(null)
    setGlobalLoading?.(true)

    try {
      const result = await bulkRejectPendingCandidates(selectedVisiblePendingIds, note || undefined)
      setSelectedCandidateIds({})
      setStatus?.(`선택 항목 ${result.updatedCount}건을 거절 처리했어요.`)
      await onChanged()
    } catch (error) {
      const msg = error instanceof Error ? error.message : "pending 후보 일괄 거절 실패"
      setStatus?.(`오류: ${msg}`)
    } finally {
      setGlobalLoading?.(false)
    }
  }

  async function handleBulkApprove() {
    if (selectedVisiblePendingIds.length === 0) {
      return
    }

    const items = selectedVisiblePendingIds.map((candidateId) => {
      const releaseId = selectedReleaseIds[candidateId]
      return releaseId ? { candidateId, releaseId } : { candidateId }
    })

    setStatus?.(null)
    setGlobalLoading?.(true)

    try {
      const result = await bulkApprovePendingCandidates(items)
      setSelectedCandidateIds({})
      setStatus?.(`선택 항목 ${result.updatedCount}건을 승인 처리했어요.`)
      await onChanged()
    } catch (error) {
      const msg = error instanceof Error ? error.message : "pending 후보 일괄 승인 실패"
      setStatus?.(`오류: ${msg}`)
    } finally {
      setGlobalLoading?.(false)
    }
  }

  return (
    <section className="space-y-4 rounded-xl border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">수집 후보 검수</h3>
          <p className="text-xs text-gray-500">
            스토어별로 나눠 보고, 같은 스토어의 같은 앨범 후보는 백엔드에서 하나로 합쳐 관리합니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
            onClick={() => onChanged()}
            disabled={isLoadingGlobal}
          >
            새로고침
          </button>
          <button
            type="button"
            className="rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-800 hover:bg-green-100 disabled:opacity-50"
            onClick={handleBulkApprove}
            disabled={isLoadingGlobal || selectedVisiblePendingIds.length === 0}
          >
            선택 항목 승인 {selectedVisiblePendingIds.length > 0 ? `(${selectedVisiblePendingIds.length})` : ""}
          </button>
          <button
            type="button"
            className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 hover:bg-amber-100 disabled:opacity-50"
            onClick={handleBulkReject}
            disabled={isLoadingGlobal || selectedVisiblePendingIds.length === 0}
          >
            선택 항목 거절 {selectedVisiblePendingIds.length > 0 ? `(${selectedVisiblePendingIds.length})` : ""}
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border bg-gray-50 p-3">
          <div className="text-xs text-gray-500">전체 후보</div>
          <div className="mt-1 text-2xl font-semibold">{candidates.length}</div>
        </div>
        <div className="rounded-lg border bg-gray-50 p-3">
          <div className="text-xs text-gray-500">검수 대기</div>
          <div className="mt-1 text-2xl font-semibold">{countsByStatus.PENDING}</div>
        </div>
        <div className="rounded-lg border bg-gray-50 p-3">
          <div className="text-xs text-gray-500">현재 필터 결과</div>
          <div className="mt-1 text-2xl font-semibold">{filteredCandidates.length}</div>
        </div>
      </div>

      <div className="space-y-3 rounded-lg border p-3">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px]">
          <label className="space-y-1 text-sm">
            <span className="text-xs font-medium text-gray-600">검색</span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="아티스트, 앨범명, 원본 제목 검색"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-xs font-medium text-gray-600">상태</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as PendingCandidateStatus | "ALL")}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {STATUS_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-xs font-medium text-gray-600">스토어</span>
            <select
              value={storeFilter}
              onChange={(event) => setStoreFilter(event.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="ALL">전체 스토어</option>
              {stores.map((store) => (
                <option key={store.id} value={store.slug}>
                  {store.name} ({countsByStore[store.slug] ?? 0})
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStoreFilter("ALL")}
            className={`rounded-full border px-3 py-1 text-xs ${storeFilter === "ALL" ? "border-gray-900 bg-gray-900 text-white" : "bg-white text-gray-600"}`}
          >
            전체 ({candidates.length})
          </button>
          {stores
            .filter((store) => (countsByStore[store.slug] ?? 0) > 0)
            .map((store) => (
              <button
                key={store.id}
                type="button"
                onClick={() => setStoreFilter(store.slug)}
                className={`rounded-full border px-3 py-1 text-xs ${storeFilter === store.slug ? "border-gray-900 bg-gray-900 text-white" : "bg-white text-gray-600"}`}
              >
                {store.name} ({countsByStore[store.slug] ?? 0})
              </button>
            ))}
        </div>
      </div>

      {visiblePendingCandidates.length > 0 && (
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={allVisiblePendingSelected}
            onChange={(event) => toggleSelectAllVisible(event.target.checked)}
            disabled={isLoadingGlobal}
          />
          현재 보이는 검수 대기 항목 전체 선택 ({visiblePendingCandidates.length})
        </label>
      )}

      {filteredCandidates.length === 0 ? (
        <div className="rounded-lg border p-3 text-sm text-gray-600">현재 조건에 맞는 수집 후보가 없습니다.</div>
      ) : (
        <ul className="space-y-3">
          {filteredCandidates.map((candidate) => {
            const releaseSelection = selectedReleaseIds[candidate.id] ?? candidate.matchedReleaseId ?? ""
            const isPending = candidate.status === "PENDING"

            return (
              <li key={candidate.id} className="space-y-3 rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  {isPending ? (
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={Boolean(selectedCandidateIds[candidate.id])}
                      onChange={(event) => toggleCandidateSelection(candidate.id, event.target.checked)}
                      disabled={isLoadingGlobal}
                    />
                  ) : (
                    <span className="mt-1 block h-4 w-4 rounded-full border bg-gray-100" />
                  )}

                  <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                      {candidate.coverImageUrl ? (
                        <Image
                          src={candidate.coverImageUrl}
                          alt={`${candidate.artistName} - ${candidate.albumTitle}`}
                          width={96}
                          height={96}
                          className="h-24 w-24 rounded-md border object-cover"
                        />
                      ) : null}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-semibold">
                          {candidate.artistName} - {candidate.albumTitle}
                        </div>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                          {PENDING_CANDIDATE_STATUS_LABELS[candidate.status]}
                        </span>
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                          {candidate.store.name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">원본 제목: {candidate.sourceProductTitle}</div>
                      <div className="text-xs text-gray-500">
                        가격: {typeof candidate.price === "number" ? `${candidate.price.toLocaleString()}원` : "정보 없음"}
                      </div>
                      {candidate.matchedReleaseId && (
                        <div className="text-xs font-medium text-emerald-700">
                          기존 앨범 자동 매칭 후보: ID {candidate.matchedReleaseId}
                        </div>
                      )}
                      {candidate.note ? <div className="text-xs text-gray-500">메모: {candidate.note}</div> : null}
                      <a
                        href={candidate.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-xs text-blue-600 underline-offset-2 hover:underline"
                      >
                        {candidate.url}
                      </a>
                    </div>

                    {isPending ? (
                      <>
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-gray-600">
                            기존 앨범에 연결할 경우 선택하세요. 비워두면 새 앨범으로 등록됩니다.
                          </p>
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
                      </>
                    ) : null}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
