"use client"

import { useState } from "react"
import { ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { FilterOption } from "@/lib/filters"

interface EventFilterProps {
  label: string
  icon: React.ReactNode
  options: FilterOption[]
  selected: string[]
  onSelectionChange: (values: string[]) => void
  grouped?: boolean
}

export function EventFilter({
  label,
  icon,
  options,
  selected,
  onSelectionChange,
  grouped = false,
}: EventFilterProps) {
  const [open, setOpen] = useState(false)

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onSelectionChange(selected.filter((v) => v !== value))
    } else {
      onSelectionChange([...selected, value])
    }
  }

  const handleClear = () => {
    onSelectionChange([])
  }

  // Group options if needed
  const groupedOptions = grouped
    ? options.reduce<Record<string, FilterOption[]>>((acc, option) => {
        const group = option.group || "Other"
        if (!acc[group]) acc[group] = []
        acc[group].push(option)
        return acc
      }, {})
    : { "": options }

  const hasSelections = selected.length > 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-7 md:h-8 px-2 md:px-2.5 text-xs gap-1 relative bg-transparent",
            hasSelections && "border-foreground/30"
          )}
        >
          <span className="flex items-center gap-1">
            {icon}
            <span className="hidden md:inline">{label}</span>
          </span>
          {hasSelections ? (
            <span className="flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-medium bg-foreground text-background rounded-sm">
              {selected.length}
            </span>
          ) : (
            <ChevronDown className="h-3 w-3 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-0 max-h-[min(320px,70vh)] flex flex-col">
        <div className="overflow-y-auto flex-1 p-2">
          {Object.entries(groupedOptions).map(([group, groupOptions]) => (
            <div key={group}>
              {grouped && group && (
                <div className="px-2 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider sticky top-0 bg-popover">
                  {group}
                </div>
              )}
              {groupOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/50 rounded cursor-pointer"
                >
                  <Checkbox
                    checked={selected.includes(option.value)}
                    onCheckedChange={() => handleToggle(option.value)}
                  />
                  <span className="text-xs truncate">{option.label}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
        {hasSelections && (
          <div className="border-t border-border p-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="w-full h-7 text-xs gap-1"
            >
              <X className="h-3 w-3" />
              Clear {label}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
