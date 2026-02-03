"use client"

import type { Store } from "@/lib/api"
import { deleteStore } from "@/lib/api"

type Props = {
  stores: Store[]
  onChanged: () => Promise<void>
  isLoadingGlobal?: boolean
  setStatus?: (msg: string | null) => void
}

export function StoreList({
  stores,
  onChanged,
  isLoadingGlobal,
  setStatus,
}: Props) {
  async function onDelete(store: Store) {
    const ok = window.confirm(
      `"${store.name}" 스토어를 삭제할까요?\n(이 작업은 되돌릴 수 없습니다.)`
    )
    if (!ok) return

    setStatus?.(null)

    try {
      await deleteStore(store.id)
      setStatus?.(`✅ 스토어 삭제 완료: ${store.name}`)
      await onChanged()
    } catch (e) {
      const msg = e instanceof Error ? e.message : "스토어 삭제 실패"
      setStatus?.(`❌ 스토어 삭제 실패: ${msg}`)
    }
  }

  return (
    <section className="space-y-3 rounded-xl border p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">등록된 스토어</h3>
          <p className="text-xs text-gray-500">
            listingsCount가 0인 스토어만 삭제 가능합니다.
          </p>
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

      {stores.length === 0 ? (
        <div className="rounded-lg border p-3 text-sm text-gray-600">
          아직 등록된 스토어가 없습니다.
        </div>
      ) : (
        <ul className="space-y-2">
          {stores.map((s) => {
            const canDelete = s.listingsCount === 0

            return (
              <li key={s.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 overflow-hidden rounded-md border bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.iconUrl}
                          alt={`${s.name} icon`}
                          className="h-full w-full object-contain p-1"
                          loading="lazy"
                          onError={(e) => {
                            ;(e.currentTarget as HTMLImageElement).style.display =
                              "none"
                          }}
                        />
                      </div>

                      <div className="truncate text-sm font-medium">{s.name}</div>

                      <span className="rounded-md border px-2 py-0.5 text-xs text-gray-600">
                        {s.slug}
                      </span>

                      <span className="rounded-md border px-2 py-0.5 text-xs text-gray-500">
                        listings: {s.listingsCount}
                      </span>
                    </div>

                    <div className="mt-1 truncate text-xs text-gray-600">
                      iconUrl: <span className="font-mono">{s.iconUrl}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={
                      canDelete
                        ? "shrink-0 rounded-md border border-red-300 bg-white px-3 py-1 text-xs text-red-700 hover:bg-red-50"
                        : "shrink-0 rounded-md border px-3 py-1 text-xs text-gray-400 bg-gray-50 cursor-not-allowed"
                    }
                    disabled={!canDelete || isLoadingGlobal}
                    onClick={() => onDelete(s)}
                    title={
                      canDelete
                        ? "스토어 삭제"
                        : "참조 중인 listing이 있어 삭제할 수 없습니다."
                    }
                  >
                    삭제
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
