"use client"

import { useEffect, useState } from "react"
import { fetchStores } from "@/lib/api"

type Store = {
  id: string
  name: string
  slug: string
  iconUrl: string
}

type Props = {
  isLoadingGlobal?: boolean
  setStatus?: (msg: string | null) => void
}

export function StoreList({ isLoadingGlobal, setStatus }: Props) {
  const [stores, setStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchStores()
      setStores(data)
      setStatus?.(null)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "스토어 목록을 불러오지 못했습니다."
      setError(msg)
      setStatus?.(`❌ 스토어 목록 로드 실패: ${msg}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refresh().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="space-y-3 rounded-xl border p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">등록된 스토어</h3>
          <p className="text-xs text-gray-500">
            slug는 판매처(Listing)에서 참조하므로 등록 후 변경에 주의하세요.
          </p>
        </div>

        <button
          type="button"
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          onClick={() => refresh()}
          disabled={isLoading || isLoadingGlobal}
        >
          {isLoading ? "불러오는 중..." : "새로고침"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {stores.length === 0 && !error ? (
        <div className="rounded-lg border p-3 text-sm text-gray-600">
          아직 등록된 스토어가 없습니다.
        </div>
      ) : (
        <ul className="space-y-2">
          {stores.map((s) => (
            <li key={s.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {/* 아이콘 미리보기 */}
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
                  </div>

                  <div className="mt-1 truncate text-xs text-gray-600">
                    iconUrl: <span className="font-mono">{s.iconUrl}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="shrink-0 rounded-md border px-3 py-1 text-xs hover:bg-gray-50"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(s.slug)
                      setStatus?.(`✅ slug 복사됨: ${s.slug}`)
                    } catch {
                      setStatus?.("❌ 복사 실패: 브라우저 권한을 확인해 주세요.")
                    }
                  }}
                >
                  slug 복사
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
