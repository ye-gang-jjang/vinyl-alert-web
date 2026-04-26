import { fetchReleaseById } from "@/features/releases/api/releases";
import { ReleasePageClient } from "@/features/releases/components/ReleasePageClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReleasePage({ params }: PageProps) {
  const { id } = await params;
  const release = await fetchReleaseById(id);

  return <ReleasePageClient initialRelease={release} releaseId={id} />;
}
