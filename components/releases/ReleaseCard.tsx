import Link from "next/link";
import { formatCollectedAgo } from "@/lib/formatters/formatCollectedAgo";

type ReleaseCardProps = {
  id: string;
  artist: string;
  album: string;
  coverImageUrl?: string;
  storesCount: number;
  latestCollectedAt?: string | null;
};

export function ReleaseCard({
  id,
  artist,
  album,
  coverImageUrl,
  storesCount,
  latestCollectedAt,
}: ReleaseCardProps) {
  const collectedText = formatCollectedAgo({
    latestCollectedAt,
  });

  return (
    <Link
      href={`/releases/${id}`}
      className="
        block rounded-xl border bg-white
        transition-all
        hover:bg-gray-50 hover:shadow-sm
        active:scale-[0.98] active:bg-gray-100
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300
      "
    >
      <div className="flex gap-4 p-4">
        {/* Cover image */}
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-white">
          {coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImageUrl}
              alt={`${artist} - ${album} cover`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-semibold">
            {artist} — {album}
          </div>

          <div className="mt-2 text-xs text-gray-500">
            판매처 {storesCount}
            최근 업데이트: {collectedText}
          </div>
        </div>
      </div>
    </Link>
  );
}
