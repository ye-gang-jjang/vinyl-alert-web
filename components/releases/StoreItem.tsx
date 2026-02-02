import { formatCollectedAgo } from "@/lib/formatters/formatCollectedAgo"

type StoreItemProps = {
  name: string
  title: string
  url: string
  collectedAt?: string | null
  latestCollectedAt?: string | null
}

export function StoreItem({
  name,
  title,
  url,
  collectedAt,
  latestCollectedAt,
}: StoreItemProps) {
  const collectedText = formatCollectedAgo({
    latestCollectedAt,
    collectedAt,
  })

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="block rounded-xl border p-4 hover:bg-gray-50"
    >
      <div className="text-sm text-gray-500">{name}</div>
      <div className="mt-1 font-medium">{title}</div>
      <div className="mt-2 text-sm text-gray-600">
        Collected: {collectedText}
      </div>
    </a>
  )
}
