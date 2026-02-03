"use client"

import { useState } from "react"
import type { Release } from "@/lib/types"
import { deleteListing, deleteRelease } from "@/lib/api"
import { ReleaseCombobox } from "@/components/admin/ReleaseCombobox"

type Props = {
  releases: Release[]
  selectedReleaseId: string
  onSelectReleaseId: (id: string) => void
  onRefreshReleases: () => Promise<void>
  isLoadingGlobal?: boolean
  setStatus?: (msg: string | null) => void
  setGlobalLoading?: (loading: boolean) => void
}

export function ManageReleaseListings({
  releases,
  selectedReleaseId,
  onSelectReleaseId,
  onRefreshReleases,
  isLoadingGlobal,
  setStatus,
  setGlobalLoading,
}: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const selectedRelease = releases.find((r) => r.id === selectedReleaseId)

  return (
    <div className="space-y-4 rounded-xl border p-4">
      <h2 className="text-lg font-semibold">삭제/정리</h2>

      {/* 대상 릴리즈 선택 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">대상 릴리즈 선택</label>

        <ReleaseCombobox
          releases={releases}
          selectedReleaseId={selectedReleaseId}
          onSelectReleaseId={onSelectReleaseId}
          disabled={releases.length === 0 || isLoading || isLoadingGlobal}
        />

        {selectedReleaseId && (
          <p className="text-xs text-gray-500">
            선택된 릴리즈 ID:{" "}
            <span className="font-medium">{selectedReleaseId}</span>
          </p>
        )}
      </div>

      {/* 등록된 판매처 목록 + 삭제 */}
      <div className="space-y-3 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">등록된 판매처</h3>
          <div className="text-xs text-gray-500">
            {selectedRelease ? `${selectedRelease.listings.length}개` : "-"}
          </div>
        </div>

        {!selectedReleaseId ? (
          <p className="text-sm text-gray-600">릴리즈를 선택해 주세요.</p>
        ) : !selectedRelease ? (
          <p className="text-sm text-gray-600">
            선택된 릴리즈를 찾을 수 없습니다.
          </p>
        ) : selectedRelease.listings.length === 0 ? (
          <p className="text-sm text-gray-600">삭제할 판매처가 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {selectedRelease.listings.map((l) => (
              <li
                key={l.id}
                className="flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {l.sourceName}
                  </div>
                  <div className="truncate text-xs text-gray-600">
                    {l.sourceProductTitle}
                  </div>
                </div>

                <button
                  type="button"
                  className="shrink-0 rounded-md border px-3 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
                  disabled={isLoading || isLoadingGlobal}
                  onClick={async () => {
                    const ok = window.confirm(
                      `"${l.sourceName}" 판매처를 삭제할까요?`
                    )
                    if (!ok) return

                    setStatus?.(null)
                    setIsLoading(true)
                    setGlobalLoading?.(true)

                    try {
                      await deleteListing(l.id)
                      setStatus?.("✅ 판매처를 삭제했습니다.")
                      await onRefreshReleases()
                    } catch (err: unknown) {
                      const message =
                        err instanceof Error ? err.message : "Unknown error"
                      setStatus?.(`❌ 판매처 삭제 실패: ${message}`)
                    } finally {
                      setIsLoading(false)
                      setGlobalLoading?.(false)
                    }
                  }}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 릴리즈 삭제 */}
      <div className="space-y-2 rounded-xl border border-red-200 bg-red-50 p-4">
        <h3 className="text-sm font-semibold text-red-700">릴리즈 삭제</h3>

        {!selectedReleaseId ? (
          <p className="text-sm text-red-700/80">릴리즈를 선택해 주세요.</p>
        ) : !selectedRelease ? (
          <p className="text-sm text-red-700/80">
            선택된 릴리즈를 찾을 수 없습니다.
          </p>
        ) : selectedRelease.listings.length > 0 ? (
          <p className="text-sm text-red-700/80">
            등록된 판매처가 {selectedRelease.listings.length}개 있습니다. 먼저
            판매처를 모두 삭제해 주세요.
          </p>
        ) : (
          <p className="text-sm text-red-700/80">
            판매처가 0개인 릴리즈만 삭제할 수 있습니다.
          </p>
        )}

        <button
          type="button"
          className="mt-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
          disabled={
            isLoading ||
            isLoadingGlobal ||
            !selectedReleaseId ||
            !selectedRelease ||
            selectedRelease.listings.length > 0
          }
          onClick={async () => {
            if (!selectedReleaseId) return

            const ok = window.confirm("정말 이 릴리즈를 삭제할까요?")
            if (!ok) return

            setStatus?.(null)
            setIsLoading(true)
            setGlobalLoading?.(true)

            try {
              await deleteRelease(selectedReleaseId)
              setStatus?.("✅ 릴리즈를 삭제했습니다.")
              await onRefreshReleases()
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : "Unknown error"
              setStatus?.(`❌ 릴리즈 삭제 실패: ${message}`)
            } finally {
              setIsLoading(false)
              setGlobalLoading?.(false)
            }
          }}
        >
          릴리즈 삭제
        </button>
      </div>
    </div>
  )
}
