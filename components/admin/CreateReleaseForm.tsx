"use client"

import { useState } from "react"
import { createRelease } from "@/lib/api"

type Props = {
  onCreated?: (createdId: string) => void
  setStatus?: (msg: string | null) => void
  setGlobalLoading?: (loading: boolean) => void
}

export function CreateReleaseForm({
  onCreated,
  setStatus,
  setGlobalLoading,
}: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const [artistName, setArtistName] = useState("")
  const [albumTitle, setAlbumTitle] = useState("")
  const [coverImageUrl, setCoverImageUrl] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus?.(null)
    setIsLoading(true)
    setGlobalLoading?.(true)

    try {
      const created = await createRelease({
        artistName,
        albumTitle,
        coverImageUrl: coverImageUrl || undefined,
      })

      setStatus?.(`✅ 릴리즈가 등록됨 (ID: ${created.id})`)

      setArtistName("")
      setAlbumTitle("")
      setCoverImageUrl("")
      
      onCreated?.(created.id)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error"
      setStatus?.(`❌ 릴리즈 등록 실패: ${message}`)
    } finally {
      setIsLoading(false)
      setGlobalLoading?.(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border p-4">
      <h2 className="text-lg font-semibold">릴리즈 등록</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium">가수명 (필수)</label>
        <input
          className="w-full rounded-lg border p-2"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">앨범명 (필수)</label>
        <input
          className="w-full rounded-lg border p-2"
          value={albumTitle}
          onChange={(e) => setAlbumTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">커버 이미지 URL (선택)</label>
        <input
          className="w-full rounded-lg border p-2"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          placeholder="https://..."
        />
        <p className="text-xs text-gray-500">
          대표 커버 이미지 링크를 넣으면 메인/상세에서 사용할 수 있음
        </p>
      </div>

      <button
        type="submit"
        className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "등록 중..." : "릴리즈 등록"}
      </button>
    </form>
  )
}
