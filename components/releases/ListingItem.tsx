type StoreItemProps = {
  name: string
  title: string
  collectedAgo: string
  url: string
}

export function StoreItem({
  name,
  title,
  collectedAgo,
  url,
}: StoreItemProps) {
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
        Collected: {collectedAgo}
      </div>
    </a>
  )
}
