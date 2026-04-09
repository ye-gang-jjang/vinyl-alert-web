import type { Listing } from "@/features/listings/types"
import type { PaginatedReleaseSummaries, Release, ReleaseSummary } from "@/features/releases/types"
import type { StoreRef } from "@/features/stores/types"

import type {
  ListingDto,
  PaginatedReleaseSummariesDto,
  ReleaseDto,
  ReleaseSummaryDto,
} from "./dto"

export function mapListingDto(dto: ListingDto): Listing {
  return {
    id: dto.id,
    sourceName: dto.sourceName,
    sourceProductTitle: dto.sourceProductTitle,
    url: dto.url,
    imageUrl: dto.imageUrl,
    collectedAt: dto.collectedAt,
    latestCollectedAt: dto.latestCollectedAt ?? null,
    price: dto.price ?? null,
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
    stores: Array.isArray(dto.stores) ? dto.stores.map(mapStoreRefDto) : [],
    collectedAt: dto.collectedAt ?? null,
    latestCollectedAt: dto.latestCollectedAt ?? null,
  }
}

function mapStoreRefDto(dto: StoreRef): StoreRef {
  return {
    slug: dto.slug,
    name: dto.name,
    iconUrl: dto.iconUrl,
  }
}

export function mapPaginatedReleaseSummariesDto(
  dto: PaginatedReleaseSummariesDto,
): PaginatedReleaseSummaries {
  return {
    items: Array.isArray(dto.items) ? dto.items.map(mapReleaseSummaryDto) : [],
    page: dto.page,
    pageSize: dto.pageSize,
    total: dto.total,
    totalPages: dto.totalPages,
    artists: Array.isArray(dto.artists) ? dto.artists : [],
    stores: Array.isArray(dto.stores) ? dto.stores.map(mapStoreRefDto) : [],
  }
}
