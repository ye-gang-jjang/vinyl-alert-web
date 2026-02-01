"use client"

import { useEffect, useState } from "react"
import type { Release } from "@/lib/types"
import { fetchNewReleases } from "@/lib/api"
import { CreateReleaseForm } from "@/components/admin/CreateReleaseForm"
import { AddListingForm } from "@/components/admin/AddListingForm"

export default function AdminPage() {
  const [status, setStatus] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [releases, setReleases] = useState<Release[]>([])
  const [selectedReleaseId, setSelectedReleaseId] = useState("")

  async function refreshReleases() {
    setIsLoading(true)
    try {
      const data = await fetchNewReleases()
      setReleases(data)
      if (!selectedReleaseId && data.length > 0) {
        setSelectedReleaseId(data[0].id)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshReleases().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">관리자</h1>
        <p className="text-sm text-gray-600">
          MVP 단계: 수동으로 릴리즈/판매처 정보를 등록함
        </p>
      </header>

      <CreateReleaseForm
        setStatus={setStatus}
        setGlobalLoading={setIsLoading}
        onCreated={async (createdId) => {
          await refreshReleases()
          setSelectedReleaseId(createdId)
        }}
      />

      <AddListingForm
        releases={releases}
        selectedReleaseId={selectedReleaseId}
        onSelectReleaseId={setSelectedReleaseId}
        onRefreshReleases={refreshReleases}
        isLoadingGlobal={isLoading}
        setGlobalLoading={setIsLoading}
        setStatus={setStatus}
      />

      {status && <p className="text-sm font-medium">{status}</p>}
    </div>
  )
}
