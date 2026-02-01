"use client"

import { useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { getStoreIconUrl } from "@/lib/constants/storeIcons"
import { STORES } from "@/lib/constants/stores"

type SortKey = "default" | "artist_asc" | "album_asc"

type Props = {
  artists: string[]
  selectedArtist: string
  selectedStore: string
  selectedSort: SortKey
}

export default function ReleaseControls({
  artists,
  selectedArtist,
  selectedStore,
  selectedSort,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const storeOptions = useMemo(() => STORES.map((s) => s.name), [])

  function setQuery(next: Partial<{ sort: SortKey; artist: string; store: string }>) {
    const sp = new URLSearchParams(searchParams.toString())

    if (next.sort !== undefined) {
      if (next.sort === "default") sp.delete("sort")
      else sp.set("sort", next.sort)
    }

    if (next.artist !== undefined) {
      if (!next.artist) sp.delete("artist")
      else sp.set("artist", next.artist)
    }

    if (next.store !== undefined) {
      if (!next.store) sp.delete("store")
      else sp.set("store", next.store)
    }

    const qs = sp.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  function reset() {
    router.push(pathname)
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* 정렬 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">정렬</span>
          <select
            className="h-9 rounded-md border bg-white px-2 text-sm"
            value={selectedSort}
            onChange={(e) => setQuery({ sort: e.target.value as SortKey })}
          >
            <option value="default">기본(최신 등록 순)</option>
            <option value="artist_asc">가수명 A→Z</option>
            <option value="album_asc">앨범명 A→Z</option>
          </select>
        </div>

        {/* 가수 필터 (콤보박스) */}
        <StringCombobox
          label="가수"
          placeholder="가수 선택"
          items={artists}
          value={selectedArtist}
          onChange={(v) => setQuery({ artist: v })}
        />

        {/* 판매처 필터 (아이콘 포함 콤보박스) */}
        <StoreComboboxLite
          label="판매처"
          placeholder="판매처 선택"
          items={storeOptions}
          value={selectedStore}
          onChange={(v) => setQuery({ store: v })}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" onClick={reset}>
          필터 초기화
        </Button>
      </div>
    </div>
  )
}

function StringCombobox({
  label,
  placeholder,
  items,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  items: string[]
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{label}</span>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" role="combobox" className="w-[220px] justify-between">
            <span className="truncate">{value ? value : placeholder}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[220px] p-0">
          <Command>
            <CommandInput placeholder={`${label} 검색...`} />
            <CommandList>
              <CommandEmpty>검색 결과가 없음</CommandEmpty>

              <CommandGroup>
                <CommandItem
                  value="__all__"
                  onSelect={() => {
                    onChange("")
                    setOpen(false)
                  }}
                >
                  <Check className={`mr-2 h-4 w-4 ${!value ? "opacity-100" : "opacity-0"}`} />
                  전체
                </CommandItem>

                {items.map((it) => {
                  const isSelected = value === it
                  return (
                    <CommandItem
                      key={it}
                      value={it}
                      onSelect={() => {
                        onChange(it)
                        setOpen(false)
                      }}
                    >
                      <Check className={`mr-2 h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"}`} />
                      {it}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function StoreComboboxLite({
  label,
  placeholder,
  items,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  items: string[]
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const selectedIconUrl = value ? getStoreIconUrl(value) : undefined

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{label}</span>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" role="combobox" className="w-[220px] justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <div className="h-5 w-5 shrink-0 overflow-hidden rounded bg-white">
                {selectedIconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedIconUrl} alt={`${value} icon`} className="h-full w-full object-contain" />
                ) : (
                  <div className="h-full w-full" />
                )}
              </div>
              <span className="truncate">{value ? value : placeholder}</span>
            </div>

            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[220px] p-0">
          <Command>
            <CommandInput placeholder={`${label} 검색...`} />
            <CommandList>
              <CommandEmpty>검색 결과가 없음</CommandEmpty>

              <CommandGroup>
                <CommandItem
                  value="__all__"
                  onSelect={() => {
                    onChange("")
                    setOpen(false)
                  }}
                >
                  <Check className={`mr-2 h-4 w-4 ${!value ? "opacity-100" : "opacity-0"}`} />
                  <span>전체</span>
                </CommandItem>

                {items.map((name) => {
                  const isSelected = value === name
                  const iconUrl = getStoreIconUrl(name)

                  return (
                    <CommandItem
                      key={name}
                      value={name}
                      onSelect={() => {
                        onChange(name)
                        setOpen(false)
                      }}
                    >
                      <Check className={`mr-2 h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"}`} />

                      <div className="mr-2 h-5 w-5 shrink-0 overflow-hidden rounded bg-white">
                        {iconUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={iconUrl} alt={`${name} icon`} className="h-full w-full object-contain" />
                        ) : (
                          <div className="h-full w-full" />
                        )}
                      </div>

                      <span>{name}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// React.useState 사용 때문에 필요
import React from "react"
