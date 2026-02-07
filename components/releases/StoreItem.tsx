import { formatCollectedAgo } from "@/lib/formatters/formatCollectedAgo"

type ListingStatus = "ON_SALE" | "PREORDER" | "SOLD_OUT"

type StoreItemProps = {
  name: string
  title: string
  url: string
  imageUrl?: string | null
  collectedAt?: string | null

  // ✅ 추가
  price?: number | null
  status?: ListingStatus | null
}

function displayMeta(status?: ListingStatus | null, price?: number | null) {
  const s: ListingStatus = status ?? "ON_SALE"

  if (s === "SOLD_OUT") return "품절"
  if (s === "PREORDER") {
    return price ? `발매예정 · ${price.toLocaleString()}원` : "발매예정"
  }
  return price ? `판매중 · ${price.toLocaleString()}원` : "판매중 · 가격 정보 없음"
}

export function StoreItem({
  name,
  title,
  url,
  imageUrl,
  collectedAt,
  price,
  status,
}: StoreItemProps) {
  const collectedText = formatCollectedAgo({ collectedAt })
  const metaText = displayMeta(status, price)

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      title="새 탭에서 열기"
      className="
        block rounded-xl border p-4
        transition-all
        hover:bg-gray-50 hover:shadow-sm
        active:scale-[0.98] active:bg-gray-100
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300
      "
    >
      <div className="flex gap-4">
        {/* 왼쪽: 판매처 이미지 */}
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-white">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={`${name} icon`}
              className="h-full w-full object-contain p-2"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              -
            </div>
          )}
        </div>

        {/* 오른쪽: 텍스트 */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate font-medium">{name}</div>

            <span className="shrink-0 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
              판매처로 이동
              <span aria-hidden>↗</span>
            </span>
          </div>

          <div className="mt-1 line-clamp-2 text-sm text-gray-600">{title}</div>

          {/* ✅ 상태/가격: 메인 메타 정보 */}
          <div className="mt-2 text-sm text-gray-700">{metaText}</div>

          {/* ✅ 수집일: 하단 각주 */}
          <div className="mt-2 text-xs text-gray-400">수집: {collectedText}</div>
        </div>
      </div>
    </a>
  )
}
