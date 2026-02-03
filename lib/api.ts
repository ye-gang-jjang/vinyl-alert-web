import type { Release } from "./types"
import type { ListingDto, ReleaseDto } from "@/lib/api/dto"
import { mapListingDto, mapReleaseDto } from "@/lib/api/mappers"

/**
 * API Base URL
 * - Vercel 배포: NEXT_PUBLIC_API_BASE_URL 사용
 * - 로컬 개발: fallback으로 localhost 사용
 */
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"

/**
 * URL을 안전하게 합치는 유틸
 * (base 끝에 / 있든 없든 문제 없게)
 */
function joinUrl(base: string, path: string) {
  return `${base.replace(/\/$/, "")}${path}`
}

/* =========================
   Releases 조회
   ========================= */

export async function fetchNewReleases(): Promise<Release[]> {
  const res = await fetch(joinUrl(API_BASE, "/releases"), {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch releases")
  }

  const data: ReleaseDto[] = await res.json()
  return Array.isArray(data) ? data.map(mapReleaseDto) : []
}

export async function fetchReleaseById(id: string): Promise<Release | null> {
  const res = await fetch(joinUrl(API_BASE, `/releases/${id}`), {
    cache: "no-store",
  })

  if (!res.ok) {
    return null
  }

  const data: ReleaseDto = await res.json()
  return mapReleaseDto(data)
}

/**
 * 아티스트 페이지용: 특정 아티스트의 릴리즈만 가져오기
 * (MVP에서는 백엔드에 필터 API가 없으므로 전체를 받아서 필터링)
 */
export async function fetchReleasesByArtistName(
  artistName: string
): Promise<Release[]> {
  const releases = await fetchNewReleases()
  return releases.filter((r) => r.artistName === artistName)
}

/* =========================
   Release 생성
   ========================= */

export type CreateReleasePayload = {
  artistName: string
  albumTitle: string
  coverImageUrl?: string
}

export async function createRelease(payload: CreateReleasePayload) {
  const res = await fetch(joinUrl(API_BASE, "/releases"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error("Failed to create release")
  }

  const data: ReleaseDto = await res.json()
  return mapReleaseDto(data)
}

/* =========================
   Listing 생성
   ========================= */

export type CreateListingPayload = {
  storeSlug: string
  sourceProductTitle: string
  url: string
}

export async function addListingToRelease(
  releaseId: string,
  payload: CreateListingPayload
) {
  const res = await fetch(
    joinUrl(API_BASE, `/releases/${releaseId}/listings`),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  )

  if (!res.ok) {
    throw new Error("Failed to add listing")
  }

  const data: ListingDto = await res.json()
  return mapListingDto(data)
}

/* =========================
   Stores (Admin)
   ========================= */

export type Store = {
  id: string
  name: string
  slug: string
  iconUrl: string
}

export type CreateStorePayload = {
  name: string
  slug: string
  iconUrl: string
}

export async function fetchStores(): Promise<Store[]> {
  const res = await fetch(joinUrl(API_BASE, "/stores"), { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch stores")
  return res.json()
}

export async function createStore(payload: CreateStorePayload) {
  const res = await fetch(joinUrl(API_BASE, "/stores"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Failed to create store")
  return res.json()
}
