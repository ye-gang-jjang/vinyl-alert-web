"use client"

import { useEffect, useState } from "react"
import type { Release } from "@/lib/types"
import { addListingToRelease, fetchStores } from "@/lib/api"
import { ReleaseCombobox } from "@/components/admin/ReleaseCombobox"
import { StoreCombobox } from "@/components/admin/StoreCombobox"

type Store = {
  id: string
  name: string
  slug: string
  iconUrl: string
}

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

  const [stores, setStores] = useState<Store[]>([])
  const [storeSlug, setStoreSlug] = useState("")

  const [sourceProductTitle, setSourceProductTitle] = useState("")
  const [url, setUrl] = useState("")

  async function refreshStores() {
    try {
      const data = await fetchStores()
      setStores(data)
      if (!storeSlug && data.length > 0) {
        setStoreSlug(data[0].slug)
      }
    } catch {
      // 필요하면 setStatus로 표시해도 됨
    }
  }

  useEffect(() => {
    refreshStores().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus?.(null)
    setIsLoading(true)
    setGlobalLoading?.(true)

    try {
      if (!selectedReleaseId) throw new Error("대상 릴리즈를 선택해 주세요.")
      if (!storeSlug) throw new Error("스토어를 선택해 주세요.")

      const updated = await addListingToRelease(selectedReleaseId, {
        storeSlug,
        sourceProductTitle,
        url,
        collectedAgo: "just now",
      })

      setStatus?.(`✅ 판매처가 추가됨 (Release ID: ${updated.id})`)

      setSourceProductTitle("")
      setUrl("")

      await onRefreshReleases()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setStatus?.(`❌ 판매처 추가 실패: ${message}`)
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

          <button
            type="button"
            className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
            onClick={() => refreshStores()}
            disabled={isLoading || isLoadingGlobal}
          >
            스토어 새로고침
          </button>

          {selectedReleaseId && (
            <p className="text-xs text-gray-500">
              선택된 릴리즈 ID:{" "}
              <span className="font-medium">{selectedReleaseId}</span>
            </p>
          )}
        </div>
      </div>

      {/* 스토어 선택 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">스토어 (필수)</label>

        <StoreCombobox
          stores={stores}
          value={storeSlug}
          onChange={setStoreSlug}
          disabled={isLoading || isLoadingGlobal || stores.length === 0}
        />

        <p className="text-xs text-gray-500">
          스토어는 DB에서 관리되며, 선택한 storeSlug만 서버로 전송됨
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
        disabled={
          isLoading ||
          isLoadingGlobal ||
          releases.length === 0 ||
          stores.length === 0
        }
      >
        {isLoading ? "추가 중..." : "판매처 추가"}
      </button>
    </form>
  )
}
