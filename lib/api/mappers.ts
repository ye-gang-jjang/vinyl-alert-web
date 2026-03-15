import type { Listing, Release, ReleaseSummary, ListingStatus } from "@/lib/types"
import type { ListingDto, ReleaseDto, ReleaseSummaryDto } from "./dto"

function normalizeStatus(status: unknown): ListingStatus {
  if (status === "ON_SALE" || status === "PREORDER" || status === "SOLD_OUT") {
    return status
  }
  return "ON_SALE"
}

export function mapListingDto(dto: ListingDto): Listing {
  return {
    id: dto.id,
    sourceName: dto.sourceName,
    sourceProductTitle: dto.sourceProductTitle,
    url: dto.url,
    imageUrl: dto.imageUrl,
    collectedAt: dto.collectedAt,
    latestCollectedAt: dto.latestCollectedAt ?? null,

    // ✅ 추가
    price: dto.price ?? null,
    status: normalizeStatus(dto.status),
  }
}

export function mapReleaseDto(dto: ReleaseDto): Release {
  return {
    id: dto.id,
    artistName: dto.artistName,
    albumTitle: dto.albumTitle,
    coverImageUrl: dto.coverImageUrl,
    storesCount: dto.storesCount,
    listings: Array.isArray(dto.listings) ? dto.listings.map(mapListingDto) : [],
    collectedAt: dto.collectedAt ?? null,
    latestCollectedAt: dto.latestCollectedAt ?? null,
  }
}

export function mapReleaseSummaryDto(dto: ReleaseSummaryDto): ReleaseSummary {
  return {
    id: dto.id,
    artistName: dto.artistName,
    albumTitle: dto.albumTitle,
    coverImageUrl: dto.coverImageUrl,
    storesCount: dto.storesCount,
    storeNames: Array.isArray(dto.storeNames) ? dto.storeNames : [],
    collectedAt: dto.collectedAt ?? null,
    latestCollectedAt: dto.latestCollectedAt ?? null,
  }
}
