import type { Listing, Release } from "@/lib/types"
import type { ListingDto, ReleaseDto } from "./dto"

export function mapListingDto(dto: ListingDto): Listing {
  return {
    id: dto.id,
    sourceName: dto.sourceName,
    sourceProductTitle: dto.sourceProductTitle,
    url: dto.url,
    imageUrl: dto.imageUrl,
    collectedAt: dto.collectedAt,
    latestCollectedAt: dto.latestCollectedAt ?? null,
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
