export const STORE_ICON_MAP: Record<string, string> = {
  "서울 바이닐": "/store-icons/seoulvinyl.png",
  "서울 바이닐": "/store-icons/seoulvinyl.png",
  "서울 바이닐": "/store-icons/seoulvinyl.png",
  "서울 바이닐": "/store-icons/seoulvinyl.png",
}

export function getStoreIconUrl(storeName: string): string | undefined {
  const normalized = storeName.trim()
  return STORE_ICON_MAP[normalized]
}
