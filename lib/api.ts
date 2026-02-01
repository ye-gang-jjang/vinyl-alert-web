import type { Release } from "./types"

// ✅ 브라우저에서도 필요하므로 NEXT_PUBLIC_ 사용
// - 로컬: .env.local에 설정
// - 배포: Vercel(또는 배포 플랫폼) 환경변수로 설정
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

function requireApiBase(): string {
  if (!API_BASE) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not set. Add it to .env.local (and your deployment env vars)."
    )
  }
  return API_BASE
}

async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })

  if (!res.ok) {
    // 디버깅에 도움 되도록 본문도 읽어봄(실패해도 무시)
    let detail = ""
    try {
      detail = await res.text()
    } catch {}
    throw new Error(`Request failed (${res.status}): ${detail || res.statusText}`)
  }

  return res.json()
}

export async function fetchNewReleases(): Promise<Release[]> {
  const base = requireApiBase()
  return fetchJson<Release[]>(`${base}/releases`)
}

export async function fetchReleaseById(id: string): Promise<Release | null> {
  const base = requireApiBase()
  const res = await fetch(`${base}/releases/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  return (await res.json()) as Release
}


export async function fetchReleasesByArtistName(
  artistName: string
): Promise<Release[]> {
  // 지금은 서버 필터가 없으니 전체 받아서 필터링
  const releases = await fetchNewReleases()
  return releases.filter((r) => r.artistName === artistName)
}

export type CreateReleasePayload = {
  artistName: string
  albumTitle: string
  color?: string
  format?: string
  coverImageUrl?: string
}

export async function createRelease(
  payload: CreateReleasePayload
): Promise<Release> {
  const base = requireApiBase()
  return fetchJson<Release>(`${base}/releases`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export type CreateListingPayload = {
  sourceName: string
  sourceProductTitle: string
  url: string
  collectedAgo: string
  imageUrl?: string
}

export async function addListingToRelease(
  releaseId: string,
  payload: CreateListingPayload
): Promise<Release> {
  const base = requireApiBase()
  return fetchJson<Release>(`${base}/releases/${releaseId}/listings`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
