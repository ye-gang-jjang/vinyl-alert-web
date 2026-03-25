import type { Release, ReleaseSummary } from "@/features/releases/types"
import { apiUrl, PUBLIC_REVALIDATE_SECONDS } from "@/shared/api/client"

import type { ReleaseDto, ReleaseSummaryDto } from "./dto"
import { mapReleaseDto, mapReleaseSummaryDto } from "./mappers"

export type CreateReleasePayload = {
  artistName: string
  albumTitle: string
  coverImageUrl?: string
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

export async function fetchReleaseSummaries(): Promise<ReleaseSummary[]> {
  const res = await fetch(apiUrl("/release-summaries"), {
    next: { revalidate: PUBLIC_REVALIDATE_SECONDS },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch release summaries")
  }

  const data: ReleaseSummaryDto[] = await res.json()
  return Array.isArray(data) ? data.map(mapReleaseSummaryDto) : []
}

export async function fetchReleaseSummariesByArtistName(
  artistName: string,
): Promise<ReleaseSummary[]> {
  const encodedArtistName = encodeURIComponent(artistName)
  const res = await fetch(apiUrl(`/artists/${encodedArtistName}/release-summaries`), {
    next: { revalidate: PUBLIC_REVALIDATE_SECONDS },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch artist release summaries")
  }

  const data: ReleaseSummaryDto[] = await res.json()
  return Array.isArray(data) ? data.map(mapReleaseSummaryDto) : []
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
