import { fetchNewReleases } from "@/lib/api";

export default async function sitemap() {
  const baseUrl = "https://www.lpick.shop";

  // 릴리즈 목록 가져오기
  const releases = await fetchNewReleases();

  // 릴리즈 상세 페이지들
  const releaseUrls = releases.map((r) => ({
    url: `${baseUrl}/releases/${r.id}`,
    lastModified: r.latestCollectedAt ?? new Date().toISOString(),
  }));

  // 홈 + 릴리즈 합쳐서 반환
  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
    },
    ...releaseUrls,
  ];
}
