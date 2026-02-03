"use client"

import { useEffect, useState } from "react"
import type { Release } from "@/lib/types"
import { fetchNewReleases } from "@/lib/api"
import { CreateReleaseForm } from "@/components/admin/CreateReleaseForm"
import { AddListingForm } from "@/components/admin/AddListingForm"
import { CreateStoreForm } from "@/components/admin/CreateStoreForm"

export default function AdminClient() {
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const [releases, setReleases] = useState<Release[]>([])
  const [selectedReleaseId, setSelectedReleaseId] = useState("")

  async function refreshReleases(): Promise<void> {
    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchNewReleases()
      setReleases(data)

      if (data.length === 0) {
        setSelectedReleaseId("")
      } else if (
        !selectedReleaseId ||
        !data.some((r) => r.id === selectedReleaseId)
      ) {
        setSelectedReleaseId(data[0].id)
      }
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "릴리즈 목록을 불러오지 못했습니다."
      setError(msg)
      setStatus(`오류: ${msg}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshReleases()
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

      {isLoading && releases.length === 0 && (
        <div className="rounded-xl border p-4 text-sm text-gray-600">
          릴리즈 목록을 불러오는 중...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <CreateReleaseForm
        setStatus={setStatus}
        setGlobalLoading={setIsLoading}
        onCreated={async (createdId) => {
          await refreshReleases()
          setSelectedReleaseId(createdId)
        }}
      />

      <CreateStoreForm setStatus={setStatus} setGlobalLoading={setIsLoading} />

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
