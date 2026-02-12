export const STORE_ICON_MAP: Record<string, string> = {
  "서울 바이닐": "/store-icons/seoulvinyl.png",
  "김밥레코즈": "/store-icons/gimbab.png",

  "스마트스토어": "/store-icons/smartstore.png",
  "예스24": "/store-icons/yes24.png",
  "알라딘": "/store-icons/aladin.png",

  "인스타그램": "/store-icons/instagram.png",
  "MPMG MUSIC": "/store-icons/mpmg.png",
}

export function getStoreIconUrl(storeName: string): string | undefined {
  const normalized = storeName.trim()
  return STORE_ICON_MAP[normalized]
}
