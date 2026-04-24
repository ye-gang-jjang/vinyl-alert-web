"use client"

import { Eye } from "lucide-react"
import { useEffect, useState } from "react"

import { recordReleaseView } from "@/features/releases/api/releases"

type ReleaseViewCountProps = {
  releaseId: string
  initialViewCount: number
  storesCount: number
  collectedText: string
}

export function ReleaseViewCount({
  releaseId,
  initialViewCount,
  storesCount,
  collectedText,
}: ReleaseViewCountProps) {
  const [viewCount, setViewCount] = useState(initialViewCount)

  useEffect(() => {
    let isMounted = true

    async function updateViewCount() {
      const nextViewCount = await recordReleaseView(releaseId)

      if (isMounted && typeof nextViewCount === "number") {
        setViewCount(nextViewCount)
      }
    }

    void updateViewCount()

    return () => {
      isMounted = false
    }
  }, [releaseId])

  return (
    <div className="text-sm text-gray-600">
      <div className="md:hidden">판매처 {storesCount} · 최근 업데이트: {collectedText}</div>

      <div className="mt-1 inline-flex items-center gap-1.5 md:hidden" aria-label={`조회수 ${viewCount}`}>
        <Eye className="h-4 w-4" aria-hidden="true" />
        <span>{viewCount}</span>
      </div>

      <div className="hidden space-y-1 md:block">
        <div>판매처 {storesCount}</div>
        <div>최근 업데이트: {collectedText}</div>
        <div className="inline-flex items-center gap-1.5" aria-label={`조회수 ${viewCount}`}>
          <Eye className="h-4 w-4" aria-hidden="true" />
          <span>{viewCount}</span>
        </div>
      </div>
    </div>
  )
}
