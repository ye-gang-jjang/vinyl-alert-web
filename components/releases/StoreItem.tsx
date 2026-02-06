import { formatCollectedAgo } from "@/lib/formatters/formatCollectedAgo"

type StoreItemProps = {
  name: string
  title: string
  url: string
  imageUrl?: string | null
  collectedAt?: string | null
}

export function StoreItem({
  name,
  title,
  url,
  imageUrl,
  collectedAt,
}: StoreItemProps) {
  const collectedText = formatCollectedAgo({ collectedAt })

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="block rounded-xl border p-4 transition hover:bg-gray-50 hover:shadow-sm"
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

            <span className="shrink-0 text-sm text-red-600 hover:underline">
              판매처로 이동
            </span>
          </div>

          <div className="mt-1 line-clamp-2 text-sm text-gray-600">
            {title}
          </div>

          <div className="mt-2 text-xs text-gray-500">
            수집: {collectedText}
          </div>
        </div>
      </div>
    </a>
  )
}
