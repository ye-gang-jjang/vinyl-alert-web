import type { Store } from "@/features/stores/types"
import { apiUrl } from "@/shared/api/client"

export type CreateStorePayload = {
  name: string
  slug: string
  iconUrl: string
}

export async function fetchStores(): Promise<Store[]> {
  const res = await fetch(apiUrl("/stores"), { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch stores")
  return res.json()
}

export async function createStore(payload: CreateStorePayload) {
  const res = await fetch(apiUrl("/stores"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`스토어 생성 실패 (${res.status})${body ? `: ${body}` : ""}`)
  }

  return res.json()
}

export async function deleteStore(storeId: string) {
  const res = await fetch(apiUrl(`/stores/${storeId}`), {
    method: "DELETE",
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Failed to delete store (${res.status})${body ? `: ${body}` : ""}`)
  }
}
