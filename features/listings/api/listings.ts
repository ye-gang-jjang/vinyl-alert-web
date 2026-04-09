import type { Release } from "@/features/releases/types"
import { mapListingDto, mapReleaseDto } from "@/features/releases/api/mappers"
import type { ListingDto, ReleaseDto } from "@/features/releases/api/dto"
import { apiUrl } from "@/shared/api/client"

export type CreateListingPayload = {
  storeSlug: string
  sourceProductTitle: string
  url: string
  price?: number | null
}

export type UpdateListingPayload = {
  price?: number | null
}

export async function addListingToRelease(
  releaseId: string,
  payload: CreateListingPayload,
): Promise<Release> {
  const res = await fetch(apiUrl(`/releases/${releaseId}/listings`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error("Failed to add listing")
  }

  const data: ReleaseDto = await res.json()
  return mapReleaseDto(data)
}

export async function updateListing(listingId: string, payload: UpdateListingPayload) {
  const res = await fetch(apiUrl(`/listings/${listingId}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Failed to update listing (${res.status})${body ? `: ${body}` : ""}`)
  }

  const data: ListingDto = await res.json()
  return mapListingDto(data)
}

export async function deleteListing(listingId: string) {
  const res = await fetch(apiUrl(`/listings/${listingId}`), {
    method: "DELETE",
  })

  if (!res.ok) {
    throw new Error("Failed to delete listing")
  }

  return true
}
