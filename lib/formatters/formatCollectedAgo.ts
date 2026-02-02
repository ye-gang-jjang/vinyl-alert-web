type FormatCollectedAgoArgs = {
  collectedAt?: string | null;
  latestCollectedAt?: string | null;
  now?: Date; // 테스트 용이
  fallback?: string; // 예: "-"
};

export function formatCollectedAgo({
  collectedAt,
  latestCollectedAt,
  now = new Date(),
  fallback = "-",
}: FormatCollectedAgoArgs): string {
  const iso = latestCollectedAt ?? collectedAt;
  if (!iso) return fallback;

  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return fallback;

  const diffMs = now.getTime() - dt.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  // 미래/동일 시각 방어
  if (diffSec <= 10) return "방금 전";

  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min}분 전`;

  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;

  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}일 전`;

  // 오래된 건 날짜로
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}
