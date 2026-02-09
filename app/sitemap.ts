import { fetchNewReleases } from "@/lib/api";

export default async function sitemap() {
  const baseUrl = "https://www.lpick.shop";
  const releases = await fetchNewReleases();

  const releaseUrls = releases.map((r) => {
    const lastMod = r.latestCollectedAt
      ? new Date(r.latestCollectedAt).toISOString()
      : new Date().toISOString();

    return {
      url: `${baseUrl}/releases/${r.id}`,
      lastModified: lastMod,
    };
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
    },
    ...releaseUrls,
  ];
}
