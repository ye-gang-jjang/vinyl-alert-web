import type { PaginatedReleaseSummaries, Release } from "@/features/releases/types"
import { apiUrl, PUBLIC_REVALIDATE_SECONDS } from "@/shared/api/client"

import type { PaginatedReleaseSummariesDto, ReleaseDto } from "./dto"
import { mapPaginatedReleaseSummariesDto, mapReleaseDto } from "./mappers"

export type CreateReleasePayload = {
  artistName: string
  albumTitle: string
  coverImageUrl?: string
}

type FetchReleaseSummaryParams = {
  page?: number
  pageSize?: number
  artist?: string
  store?: string
  sort?: string
}

function buildSummaryQuery(params: FetchReleaseSummaryParams) {
  const query = new URLSearchParams()

  if (params.page && params.page > 1) {
    query.set("page", String(params.page))
  }

  if (params.pageSize) {
    query.set("pageSize", String(params.pageSize))
  }

  if (params.artist) {
    query.set("artist", params.artist)
  }

  if (params.store) {
    query.set("store", params.store)
  }

  if (params.sort && params.sort !== "default") {
    query.set("sort", params.sort)
  }

  const queryString = query.toString()
  return queryString ? `?${queryString}` : ""
}

export async function fetchNewReleases(): Promise<Release[]> {
  const res = await fetch(apiUrl("/releases"), {
    next: { revalidate: PUBLIC_REVALIDATE_SECONDS },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch releases")
  }

  const data: ReleaseDto[] = await res.json()
  return Array.isArray(data) ? data.map(mapReleaseDto) : []
}

export async function fetchReleaseSummaries(
  params: FetchReleaseSummaryParams = {},
): Promise<PaginatedReleaseSummaries> {
  const res = await fetch(apiUrl(`/release-summaries${buildSummaryQuery(params)}`), {
    next: { revalidate: PUBLIC_REVALIDATE_SECONDS },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch release summaries")
  }

  const data: PaginatedReleaseSummariesDto = await res.json()
  return mapPaginatedReleaseSummariesDto(data)
}

export async function fetchReleaseSummariesByArtistName(
  artistName: string,
  params: Pick<FetchReleaseSummaryParams, "page" | "pageSize"> = {},
): Promise<PaginatedReleaseSummaries> {
  const encodedArtistName = encodeURIComponent(artistName)
  const res = await fetch(
    apiUrl(`/artists/${encodedArtistName}/release-summaries${buildSummaryQuery(params)}`),
    {
    next: { revalidate: PUBLIC_REVALIDATE_SECONDS },
    },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch artist release summaries")
  }

  const data: PaginatedReleaseSummariesDto = await res.json()
  return mapPaginatedReleaseSummariesDto(data)
}

export async function fetchReleaseById(id: string): Promise<Release | null> {
  const res = await fetch(apiUrl(`/releases/${id}`), {
    next: { revalidate: PUBLIC_REVALIDATE_SECONDS },
  })

  if (!res.ok) {
    return null
  }

  const data: ReleaseDto = await res.json()
  return mapReleaseDto(data)
}

export async function fetchReleasesByArtistName(artistName: string): Promise<Release[]> {
  const releases = await fetchNewReleases()
  return releases.filter((release) => release.artistName === artistName)
}

export async function createRelease(payload: CreateReleasePayload) {
  const res = await fetch(apiUrl("/releases"), {
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

export async function deleteRelease(releaseId: string) {
  const res = await fetch(apiUrl(`/releases/${releaseId}`), {
    method: "DELETE",
  })

  if (!res.ok) {
    throw new Error("Failed to delete release")
  }

  return true
}
