"use client"

import { useState } from "react"
import type { Release } from "@/lib/types"
import { addListingToRelease } from "@/lib/api"
import { STORES } from "@/lib/constants/stores"
import { getStoreIconUrl } from "@/lib/constants/storeIcons"
import { ReleaseCombobox } from "@/components/admin/ReleaseCombobox"
import { StoreCombobox } from "@/components/admin/StoreCombobox"

type Props = {
  releases: Release[]
  selectedReleaseId: string
  onSelectReleaseId: (id: string) => void
  onRefreshReleases: () => Promise<void>
  isLoadingGlobal?: boolean
  setStatus?: (msg: string | null) => void
  setGlobalLoading?: (loading: boolean) => void
}

export function AddListingForm({
  releases,
  selectedReleaseId,
  onSelectReleaseId,
  onRefreshReleases,
  isLoadingGlobal,
  setStatus,
  setGlobalLoading,
}: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const [sourceName, setSourceName] = useState("")
  const [sourceProductTitle, setSourceProductTitle] = useState("")
  const [url, setUrl] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus?.(null)
    setIsLoading(true)
    setGlobalLoading?.(true)

    try {
      if (!selectedReleaseId) throw new Error("대상 릴리즈를 선택해 주세요.")
      if (!sourceName) throw new Error("판매처를 선택해 주세요.")

      const updated = await addListingToRelease(selectedReleaseId, {
        sourceName,
        sourceProductTitle,
        url,
        collectedAgo: "just now",
        imageUrl: getStoreIconUrl(sourceName), // 프론트에서도 보내고, 백에서도 강제됨
      })

      setStatus?.(`✅ 판매처가 추가됨 (Release ID: ${updated.id})`)

      setSourceName("")
      setSourceProductTitle("")
      setUrl("")

      await onRefreshReleases()
    } catch (err: any) {
      setStatus?.(`❌ 판매처 추가 실패: ${err?.message ?? "Unknown error"}`)
    } finally {
      setIsLoading(false)
      setGlobalLoading?.(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border p-4">
      <h2 className="text-lg font-semibold">판매처 등록</h2>

      {/* 대상 릴리즈 선택 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">대상 릴리즈 선택</label>

        <ReleaseCombobox
          releases={releases}
          selectedReleaseId={selectedReleaseId}
          onSelectReleaseId={onSelectReleaseId}
          disabled={releases.length === 0 || isLoading || isLoadingGlobal}
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
            onClick={() => onRefreshReleases()}
            disabled={isLoading || isLoadingGlobal}
          >
            목록 새로고침
          </button>

          {selectedReleaseId && (
            <p className="text-xs text-gray-500">
              선택된 릴리즈 ID:{" "}
              <span className="font-medium">{selectedReleaseId}</span>
            </p>
          )}
        </div>
      </div>

      {/* 판매처 선택 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">판매처 (필수)</label>

        <StoreCombobox
          stores={STORES}
          value={sourceName}
          onChange={setSourceName}
          disabled={isLoading || isLoadingGlobal}
        />

        <p className="text-xs text-gray-500">
          판매처는 선택형으로 고정됨 (오타 방지)
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">원문 상품명 (필수)</label>
        <input
          className="w-full rounded-lg border p-2"
          value={sourceProductTitle}
          onChange={(e) => setSourceProductTitle(e.target.value)}
          placeholder="판매처에 올라온 제목을 그대로 복붙"
          required
          disabled={isLoading || isLoadingGlobal}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">상품 링크 (필수)</label>
        <input
          className="w-full rounded-lg border p-2"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          required
          disabled={isLoading || isLoadingGlobal}
        />
      </div>

      <button
        type="submit"
        className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
        disabled={isLoading || isLoadingGlobal || releases.length === 0}
      >
        {isLoading ? "추가 중..." : "판매처 추가"}
      </button>
    </form>
  )
}
