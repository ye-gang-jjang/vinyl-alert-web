"use client"

import { useEffect, useState } from "react"
import { deleteListing, updateListing } from "@/features/listings/api/listings"
import { deleteRelease } from "@/features/releases/api/releases"
import type { Release, ReleaseOption } from "@/features/releases/types"
import { ReleaseCombobox } from "@/features/admin/releases/components/ReleaseCombobox"
import { StoreCombobox } from "@/features/admin/stores/components/StoreCombobox"
import type { Store } from "@/features/stores/types"

type EditState = {
  storeSlug: string
  sourceProductTitle: string
  price: string
  dirty: boolean
}

type Props = {
  releaseOptions: ReleaseOption[]
  selectedRelease: Release | null
  stores: Store[]
  selectedReleaseId: string
  onSelectReleaseId: (id: string) => void
  onRefreshSelectedRelease: (id: string) => Promise<void>
  onRefreshReleaseOptions: () => Promise<void>
  onLoadMoreReleaseOptions?: () => Promise<void>
  hasMoreReleaseOptions?: boolean
  isLoadingMoreReleaseOptions?: boolean
  onReleaseDeleted: () => Promise<void>
  isLoadingGlobal?: boolean
  setStatus?: (msg: string | null) => void
  setGlobalLoading?: (loading: boolean) => void
}

export function ManageReleaseListings({
  releaseOptions,
  selectedRelease,
  stores,
  selectedReleaseId,
  onSelectReleaseId,
  onRefreshSelectedRelease,
  onRefreshReleaseOptions,
  onLoadMoreReleaseOptions,
  hasMoreReleaseOptions,
  isLoadingMoreReleaseOptions,
  onReleaseDeleted,
  isLoadingGlobal,
  setStatus,
  setGlobalLoading,
}: Props) {
  const [isLoading, setIsLoading] = useState(false)

  // listingId -> edit state
  const [editMap, setEditMap] = useState<Record<string, EditState>>({})

  // 선택 릴리즈 바뀌면 editMap 초기화(현재 릴리즈의 listing들로 세팅)
  useEffect(() => {
    if (!selectedRelease) {
      setEditMap({})
      return
    }

    const next: Record<string, EditState> = {}
    for (const l of selectedRelease.listings) {
      const currentPrice =
        l.price === null || typeof l.price === "undefined" ? "" : String(l.price)

      next[l.id] = {
        storeSlug: stores.find((store) => store.name === l.sourceName)?.slug ?? "",
        sourceProductTitle: l.sourceProductTitle,
        price: currentPrice,
        dirty: false,
      }
    }
    setEditMap(next)
  }, [selectedRelease, stores])

  function setEdit(listingId: string, patch: Partial<EditState>) {
    setEditMap((prev) => {
      const current = prev[listingId] ?? {
        storeSlug: "",
        sourceProductTitle: "",
        price: "",
        dirty: false,
      }
      return {
        ...prev,
        [listingId]: {
          ...current,
          ...patch,
          dirty: true,
        },
      }
    })
  }

  async function onSave(listingId: string) {
    const edit = editMap[listingId]
    if (!edit) return

    if (!edit.storeSlug) {
      setStatus?.("❌ 스토어를 선택해 주세요.")
      return
    }

    if (!edit.sourceProductTitle.trim()) {
      setStatus?.("❌ 상품 제목을 입력해 주세요.")
      return
    }

    const normalizedPrice =
      edit.price.trim() === ""
        ? null
        : Number(edit.price.replaceAll(",", ""))

    if (normalizedPrice !== null && Number.isNaN(normalizedPrice)) {
      setStatus?.("❌ 가격은 숫자만 입력해 주세요.")
      return
    }

    setStatus?.(null)
    setIsLoading(true)
    setGlobalLoading?.(true)

    try {
      await updateListing(listingId, {
        storeSlug: edit.storeSlug,
        sourceProductTitle: edit.sourceProductTitle.trim(),
        price: normalizedPrice,
      })
      setStatus?.("✅ 판매처 정보를 수정했습니다.")
      await onRefreshSelectedRelease(selectedReleaseId)

      // 저장 후 dirty 해제
      setEditMap((prev) => ({
        ...prev,
        [listingId]: { ...prev[listingId], dirty: false },
      }))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setStatus?.(`❌ 판매처 수정 실패: ${message}`)
    } finally {
      setIsLoading(false)
      setGlobalLoading?.(false)
    }
  }

  return (
    <div className="space-y-4 rounded-xl border p-4">
      <h2 className="text-lg font-semibold">삭제/정리</h2>

      {/* 대상 릴리즈 선택 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">대상 릴리즈 선택</label>

        <ReleaseCombobox
          releases={releaseOptions}
          selectedReleaseId={selectedReleaseId}
          onSelectReleaseId={onSelectReleaseId}
          disabled={releaseOptions.length === 0 || isLoading || isLoadingGlobal}
        />

        {hasMoreReleaseOptions && onLoadMoreReleaseOptions ? (
          <button
            type="button"
            className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
            onClick={() => onLoadMoreReleaseOptions()}
            disabled={isLoading || isLoadingGlobal || isLoadingMoreReleaseOptions}
          >
            {isLoadingMoreReleaseOptions ? "불러오는 중..." : "릴리즈 10개 더 불러오기"}
          </button>
        ) : null}

        <button
          type="button"
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          onClick={() => onRefreshReleaseOptions()}
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

      {/* 등록된 판매처 목록 + 수정 + 삭제 */}
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
          <p className="text-sm text-gray-600">삭제/수정할 판매처가 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {selectedRelease.listings.map((l) => {
              const edit = editMap[l.id] ?? {
                storeSlug: stores.find((store) => store.name === l.sourceName)?.slug ?? "",
                sourceProductTitle: l.sourceProductTitle,
                price:
                  l.price === null || typeof l.price === "undefined"
                    ? ""
                    : String(l.price),
                dirty: false,
              }

              return (
                <li
                  key={l.id}
                  className="flex flex-col gap-3 rounded-lg border p-3"
                >
                  <div className="flex items-start justify-between gap-3">
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
                          await onRefreshSelectedRelease(selectedReleaseId)
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
                  </div>

                  {/* ✅ 수정 영역 */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
                    <div className="space-y-1">
                      <label className="block text-xs text-gray-600">판매처</label>
                      <StoreCombobox
                        stores={stores}
                        value={edit.storeSlug}
                        onChange={(slug) => setEdit(l.id, { storeSlug: slug })}
                        disabled={isLoading || isLoadingGlobal || stores.length === 0}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs text-gray-600">상품 제목</label>
                      <input
                        className="w-full rounded-lg border p-2 text-sm"
                        value={edit.sourceProductTitle}
                        onChange={(e) =>
                          setEdit(l.id, { sourceProductTitle: e.target.value })
                        }
                        placeholder="판매처에 표시되는 제목"
                        disabled={isLoading || isLoadingGlobal}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs text-gray-600">가격(원)</label>
                      <input
                        className="w-full rounded-lg border p-2 text-sm"
                        value={edit.price}
                        onChange={(e) => setEdit(l.id, { price: e.target.value })}
                        placeholder="예: 39000"
                        inputMode="numeric"
                        disabled={isLoading || isLoadingGlobal}
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        className="w-full rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                        disabled={
                          isLoading ||
                          isLoadingGlobal ||
                          !edit.dirty
                        }
                        onClick={() => onSave(l.id)}
                      >
                        저장
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">* 제목/판매처/가격을 수정할 수 있고, 가격을 비우면 null로 저장됩니다.</p>
                </li>
              )
            })}
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
              await onReleaseDeleted()
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
