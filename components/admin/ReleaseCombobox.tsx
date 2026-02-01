"use client"

import React from "react"
import type { Release } from "@/lib/types"
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

type Props = {
  releases: Release[]
  selectedReleaseId: string
  onSelectReleaseId: (id: string) => void
  disabled?: boolean
}

function ReleaseThumb({
  coverImageUrl,
  alt,
}: {
  coverImageUrl?: string
  alt: string
}) {
  return (
    <div className="h-7 w-7 shrink-0 overflow-hidden rounded border bg-white">
      {coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverImageUrl}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="h-full w-full bg-gray-50" />
      )}
    </div>
  )
}

export function ReleaseCombobox({
  releases,
  selectedReleaseId,
  onSelectReleaseId,
  disabled,
}: Props) {
  const [open, setOpen] = React.useState(false)

  const selectedRelease = releases.find((r) => r.id === selectedReleaseId)

  const selectedLabel = selectedRelease
    ? `${selectedRelease.artistName} — ${selectedRelease.albumTitle}${
        selectedRelease.color ? ` (${selectedRelease.color})` : ""
      }${selectedRelease.format ? ` / ${selectedRelease.format}` : ""} [ID:${selectedRelease.id}]`
    : releases.length === 0
      ? "등록된 릴리즈가 없음"
      : "릴리즈 선택"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || releases.length === 0}
        >
          <div className="flex min-w-0 items-center gap-2">
            <ReleaseThumb
              coverImageUrl={selectedRelease?.coverImageUrl}
              alt={selectedRelease ? selectedLabel : "release thumbnail"}
            />
            <span className="truncate">{selectedLabel}</span>
          </div>

          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="가수/앨범/컬러/포맷 검색..." />
          <CommandList>
            <CommandEmpty>검색 결과가 없음</CommandEmpty>

            <CommandGroup>
              {releases.map((r) => {
                const label = `${r.artistName} — ${r.albumTitle}${
                  r.color ? ` (${r.color})` : ""
                }${r.format ? ` / ${r.format}` : ""} [ID:${r.id}]`
                const isSelected = selectedReleaseId === r.id

                return (
                  <CommandItem
                    key={r.id}
                    value={label}
                    onSelect={() => {
                      onSelectReleaseId(r.id)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        isSelected ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    <div className="mr-2">
                      <ReleaseThumb
                        coverImageUrl={r.coverImageUrl}
                        alt={label}
                      />
                    </div>

                    <span className="truncate">{label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
