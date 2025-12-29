import type { CalendarEvent } from "@/types/event"
import { continents, categories, categoryLabels } from "@/lib/event-schema"

export interface FilterOption {
  value: string
  label: string
  group?: string
}

export interface EventFilters {
  locations: string[]
  categories: string[]
  tags: string[]
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

export function filterEvents(
  events: CalendarEvent[],
  filters: EventFilters
): CalendarEvent[] {
  const { locations, categories: categoryFilters, tags: tagFilters } = filters

  if (locations.length === 0 && categoryFilters.length === 0 && tagFilters.length === 0) {
    return events
  }

  return events.filter((event) => {
    // Location filter (OR logic within locations)
    if (locations.length > 0) {
      const matchesContinent = event.locationContinent && locations.includes(event.locationContinent)
      const matchesCountry = event.locationCountry && locations.includes(event.locationCountry)
      if (!matchesContinent && !matchesCountry) {
        return false
      }
    }

    // Category filter (OR logic within categories)
    if (categoryFilters.length > 0) {
      const matchesCategory = event.categories?.some(cat => categoryFilters.includes(cat))
      if (!matchesCategory) {
        return false
      }
    }

    // Tag filter (OR logic within tags)
    if (tagFilters.length > 0) {
      const matchesTag = event.tags?.some(tag => tagFilters.includes(tag))
      if (!matchesTag) {
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

export function getCategoryOptions(): FilterOption[] {
  return categories.map((cat) => ({
    value: cat,
    label: categoryLabels[cat] || cat,
  }))
}

export function getTagOptions(events: CalendarEvent[]): FilterOption[] {
  const tagSet = new Set<string>()

  for (const event of events) {
    if (event.tags) {
      event.tags.forEach(tag => tagSet.add(tag))
    }
  }

  return Array.from(tagSet)
    .sort((a, b) => a.localeCompare(b))
    .map(tag => ({
      value: tag,
      label: tag,
    }))
}

export function hasActiveFilters(filters: EventFilters): boolean {
  return filters.locations.length > 0 ||
         filters.categories.length > 0 ||
         filters.tags.length > 0
}
