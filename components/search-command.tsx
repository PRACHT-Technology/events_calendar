"use client"

import { useMemo, useState } from "react"
import { format, parseISO } from "date-fns"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { searchEvents, hasResults, type GroupedSearchResults } from "@/lib/search"
import type { CalendarEvent } from "@/types/event"
import { eventTypeColors } from "@/lib/event-schema"

interface SearchCommandProps {
  events: CalendarEvent[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectEvent: (event: CalendarEvent) => void
}

function formatDateCompact(start: string, end?: string): string {
  const startDate = parseISO(start)
  if (!end) return format(startDate, "MMM d")
  const endDate = parseISO(end)
  if (format(startDate, "MMM") === format(endDate, "MMM")) {
    return `${format(startDate, "d")}-${format(endDate, "d")} ${format(startDate, "MMM")}`
  }
  return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`
}

function SearchResultItem({
  event,
  matchedField,
  matchType,
  onSelect,
}: {
  event: CalendarEvent
  matchedField: string
  matchType: "name" | "location" | "other"
  onSelect: () => void
}) {
  return (
    <CommandItem
      value={`${event.id}-${event.title}`}
      onSelect={onSelect}
      className="flex items-center gap-3 py-2.5 cursor-pointer"
    >
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: event.type ? eventTypeColors[event.type] || "#6b7280" : "#6b7280" }}
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate text-xs">{event.title}</div>
        <div className="text-muted-foreground text-[10px] flex items-center gap-1.5">
          <span>{formatDateCompact(event.startDate, event.endDate)}</span>
          {event.location && (
            <>
              <span className="text-muted-foreground/50">·</span>
              <span className="truncate">{event.location}</span>
            </>
          )}
        </div>
      </div>
      {matchType !== "name" && (
        <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 shrink-0">
          {matchedField}
        </Badge>
      )}
    </CommandItem>
  )
}

export function SearchCommand({
  events,
  open,
  onOpenChange,
  onSelectEvent,
}: SearchCommandProps) {
  const [query, setQuery] = useState("")

  const results = useMemo<GroupedSearchResults>(() => {
    return searchEvents(events, query)
  }, [events, query])

  const handleSelect = (event: CalendarEvent) => {
    onSelectEvent(event)
    setQuery("")
  }

  const showResults = query.length >= 2

  return (
    <CommandDialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen)
        if (!isOpen) setQuery("")
      }}
      title="Search Events"
      description="Search for events by name, location, or other attributes"
    >
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Search events..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {!showResults && (
            <CommandEmpty>Start typing to search events...</CommandEmpty>
          )}

          {showResults && !hasResults(results) && (
            <CommandEmpty>No events found for &quot;{query}&quot;</CommandEmpty>
          )}

          {showResults && results.byName.length > 0 && (
            <CommandGroup heading="Events by Name">
              {results.byName.map((result) => (
                <SearchResultItem
                  key={result.event.id}
                  event={result.event}
                  matchedField={result.matchedField}
                  matchType={result.matchType}
                  onSelect={() => handleSelect(result.event)}
                />
              ))}
            </CommandGroup>
          )}

          {showResults &&
            results.byName.length > 0 &&
            results.byLocation.length > 0 && <CommandSeparator />}

          {showResults && results.byLocation.length > 0 && (
            <CommandGroup heading={`Events in "${query}"`}>
              {results.byLocation.map((result) => (
                <SearchResultItem
                  key={result.event.id}
                  event={result.event}
                  matchedField={result.matchedField}
                  matchType={result.matchType}
                  onSelect={() => handleSelect(result.event)}
                />
              ))}
            </CommandGroup>
          )}

          {showResults &&
            (results.byName.length > 0 || results.byLocation.length > 0) &&
            results.byOther.length > 0 && <CommandSeparator />}

          {showResults && results.byOther.length > 0 && (
            <CommandGroup heading="Other Matches">
              {results.byOther.map((result) => (
                <SearchResultItem
                  key={result.event.id}
                  event={result.event}
                  matchedField={result.matchedField}
                  matchType={result.matchType}
                  onSelect={() => handleSelect(result.event)}
                />
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
