import type { CalendarEvent } from "@/types/event"
import { eventTypes, continents } from "@/lib/event-schema"

export interface FilterOption {
  value: string
  label: string
  group?: string
}

export interface EventFilters {
  locations: string[]
  types: string[]
}

const continentLabels: Record<string, string> = {
  "africa": "Africa",
  "asia": "Asia",
  "europe": "Europe",
  "north-america": "North America",
  "south-america": "South America",
  "oceania": "Oceania",
  "global": "Global / Online",
}

const typeLabels: Record<string, string> = {
  "conference": "Conference",
  "hackathon": "Hackathon",
  "meetup": "Meetup",
  "popup-village": "Pop-up Village",
  "festival": "Festival",
  "workshop": "Workshop",
  "summit": "Summit",
}

export function filterEvents(
  events: CalendarEvent[],
  filters: EventFilters
): CalendarEvent[] {
  const { locations, types } = filters

  if (locations.length === 0 && types.length === 0) {
    return events
  }

  return events.filter((event) => {
    // Type filter (OR logic within types)
    if (types.length > 0) {
      if (!event.type || !types.includes(event.type)) {
        return false
      }
    }

    // Location filter (OR logic within locations)
    if (locations.length > 0) {
      const matchesContinent = event.locationContinent && locations.includes(event.locationContinent)
      const matchesCountry = event.locationCountry && locations.includes(event.locationCountry)
      if (!matchesContinent && !matchesCountry) {
        return false
      }
    }

    return true
  })
}

export function getLocationOptions(events: CalendarEvent[]): FilterOption[] {
  const options: FilterOption[] = []

  // Add continents that exist in events
  const usedContinents = new Set<string>()
  const usedCountries = new Set<string>()

  for (const event of events) {
    if (event.locationContinent) {
      usedContinents.add(event.locationContinent)
    }
    if (event.locationCountry) {
      usedCountries.add(event.locationCountry)
    }
  }

  // Add continents
  for (const continent of continents) {
    if (usedContinents.has(continent)) {
      options.push({
        value: continent,
        label: continentLabels[continent] || continent,
        group: "Continent",
      })
    }
  }

  // Add countries (sorted alphabetically)
  const sortedCountries = Array.from(usedCountries).sort()
  for (const country of sortedCountries) {
    options.push({
      value: country,
      label: country,
      group: "Country",
    })
  }

  return options
}

export function getTypeOptions(): FilterOption[] {
  return eventTypes.map((type) => ({
    value: type,
    label: typeLabels[type] || type,
  }))
}

export function hasActiveFilters(filters: EventFilters): boolean {
  return filters.locations.length > 0 || filters.types.length > 0
}
