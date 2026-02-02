"use client"

import React from "react"
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

type Store = {
  id: string
  name: string
  slug: string
  iconUrl: string
}

type Props = {
  stores: Store[]
  value: string // storeSlug
  onChange: (slug: string) => void
  disabled?: boolean
}

export function StoreCombobox({ stores, value, onChange, disabled }: Props) {
  const [open, setOpen] = React.useState(false)

  const selectedStore = stores.find((s) => s.slug === value)
  const selectedLabel = selectedStore?.name ?? ""
  const selectedIconUrl = selectedStore?.iconUrl

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          <div className="flex min-w-0 items-center gap-2">
            {/* 선택된 스토어 아이콘 */}
            <div className="h-5 w-5 shrink-0 overflow-hidden rounded bg-white">
              {selectedIconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedIconUrl}
                  alt={`${selectedLabel} icon`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="h-full w-full" />
              )}
            </div>

            <span className="truncate">
              {selectedLabel ? selectedLabel : "스토어 선택"}
            </span>
          </div>

          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="스토어 검색..." />
          <CommandList>
            <CommandEmpty>검색 결과가 없음</CommandEmpty>

            <CommandGroup>
              {stores.map((s) => {
                const isSelected = value === s.slug

                return (
                  <CommandItem
                    key={s.id}
                    value={s.name}
                    onSelect={() => {
                      onChange(s.slug)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        isSelected ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    {/* 리스트 아이콘 */}
                    <div className="mr-2 h-5 w-5 shrink-0 overflow-hidden rounded bg-white">
                      {s.iconUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={s.iconUrl}
                          alt={`${s.name} icon`}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="h-full w-full" />
                      )}
                    </div>

                    <span>{s.name}</span>
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
