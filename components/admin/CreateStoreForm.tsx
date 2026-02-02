"use client"

import { useEffect, useState } from "react"
import { createStore, fetchStores } from "@/lib/api"

type Props = {
  setStatus: (v: string | null) => void
  setGlobalLoading: (v: boolean) => void
}

type Store = {
  id: string
  name: string
  slug: string
  iconUrl: string
}

function toSlug(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "")
}

export function CreateStoreForm({ setStatus, setGlobalLoading }: Props) {
  const [stores, setStores] = useState<Store[]>([])
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [iconUrl, setIconUrl] = useState("/store-icons/")

  async function refreshStores() {
    const data = await fetchStores()
    setStores(data)
  }

  useEffect(() => {
    refreshStores().catch(() => {})
  }, [])

  async function onSubmit() {
    if (!name.trim()) {
      setStatus("스토어 이름을 입력해줘.")
      return
    }
    if (!slug.trim()) {
      setStatus("slug를 입력해줘.")
      return
    }
    if (!iconUrl.trim()) {
      setStatus("아이콘 경로를 입력해줘. 예) /store-icons/xxx.png")
      return
    }

    setGlobalLoading(true)
    setStatus(null)
    try {
      await createStore({ name, slug, iconUrl })
      setStatus("스토어가 등록됐어.")
      setName("")
      setSlug("")
      setIconUrl("/store-icons/")
      await refreshStores()
    } catch (e) {
      setStatus("스토어 등록에 실패했어. slug 중복인지 확인해줘.")
    } finally {
      setGlobalLoading(false)
    }
  }

  return (
    <section className="space-y-4 rounded-lg border p-4">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">스토어 등록</h2>
        <p className="text-sm text-gray-600">
          아이콘은 프론트 public의 정적 경로를 사용함 (예: /store-icons/xxx.png)
        </p>
      </header>

      <div className="grid gap-2">
        <label className="text-sm font-medium">스토어 이름</label>
        <input
          className="rounded-md border px-3 py-2 text-sm"
          value={name}
          onChange={(e) => {
            const v = e.target.value
            setName(v)
            setSlug(toSlug(v))
          }}
          placeholder="예: 서울 바이닐"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">slug</label>
        <input
          className="rounded-md border px-3 py-2 text-sm"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="예: seoulvinyl"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">아이콘 경로</label>
        <input
          className="rounded-md border px-3 py-2 text-sm"
          value={iconUrl}
          onChange={(e) => setIconUrl(e.target.value)}
          placeholder="예: /store-icons/seoulvinyl.png"
        />
      </div>

      <button
        onClick={onSubmit}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
      >
        등록
      </button>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">등록된 스토어</h3>
        <ul className="space-y-1 text-sm text-gray-700">
          {stores.map((s) => (
            <li key={s.id}>
              {s.name} <span className="text-gray-500">({s.slug})</span>
            </li>
          ))}
          {stores.length === 0 && (
            <li className="text-gray-500">아직 등록된 스토어가 없어.</li>
          )}
        </ul>
      </div>
    </section>
  )
}
