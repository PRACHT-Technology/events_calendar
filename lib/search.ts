import type { CalendarEvent } from "@/types/event"

export interface SearchResult {
  event: CalendarEvent
  matchType: "name" | "location" | "category" | "other"
  score: number
  matchedField: string // "title", "city", "category", etc.
  matchedValue?: string // The actual matched value for categories
}

export interface GroupedSearchResults {
  byName: SearchResult[]
  byLocation: SearchResult[]
  byCategory: SearchResult[]
  byOther: SearchResult[]
}

interface SearchOptions {
  maxNameResults?: number
  maxLocationResults?: number
  maxCategoryResults?: number
  maxOtherResults?: number
}

const DEFAULT_OPTIONS: Required<SearchOptions> = {
  maxNameResults: 3,
  maxLocationResults: 5,
  maxCategoryResults: 5,
  maxOtherResults: 3,
}

/**
 * Calculate match score for a field
 * Returns 0 if no match, otherwise base score + modifiers
 */
function calculateScore(
  fieldValue: string | undefined,
  query: string,
  baseScore: number
): number {
  if (!fieldValue) return 0

  const normalizedField = fieldValue.toLowerCase()
  const normalizedQuery = query.toLowerCase()

  if (normalizedField === normalizedQuery) {
    return baseScore + 50 // Exact match
  }
  if (normalizedField.startsWith(normalizedQuery)) {
    return baseScore + 20 // Starts with
  }
  if (normalizedField.includes(normalizedQuery)) {
    return baseScore // Contains
  }

  return 0
}

/**
 * Check if any item in an array matches the query
 * Returns the matched value and score, or null if no match
 */
function matchArray(
  values: string[] | undefined,
  query: string,
  baseScore: number
): { value: string; score: number } | null {
  if (!values || values.length === 0) return null

  let bestMatch: { value: string; score: number } | null = null

  for (const value of values) {
    const score = calculateScore(value, query, baseScore)
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { value, score }
    }
  }

  return bestMatch
}

/**
 * Search events and return grouped results
 */
export function searchEvents(
  events: CalendarEvent[],
  query: string,
  options: SearchOptions = {}
): GroupedSearchResults {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const normalizedQuery = query.trim().toLowerCase()

  // Return empty results for short queries
  if (normalizedQuery.length < 2) {
    return { byName: [], byLocation: [], byCategory: [], byOther: [] }
  }

  const nameResults: SearchResult[] = []
  const locationResults: SearchResult[] = []
  const categoryResults: SearchResult[] = []
  const otherResults: SearchResult[] = []

  // Track which events are already matched to avoid duplicates across categories
  const matchedEventIds = new Set<string>()

  // First pass: name matches (highest priority)
  for (const event of events) {
    const score = calculateScore(event.title, normalizedQuery, 100)
    if (score > 0) {
      nameResults.push({
        event,
        matchType: "name",
        score,
        matchedField: "title",
      })
      matchedEventIds.add(event.id)
    }
  }

  // Second pass: location matches (for events not already matched by name)
  for (const event of events) {
    if (matchedEventIds.has(event.id)) continue

    // Check all location fields
    const locationFields: { field: string; value: string | undefined }[] = [
      { field: "city", value: event.locationCity },
      { field: "country", value: event.locationCountry },
      { field: "venue", value: event.locationVenue },
      { field: "location", value: event.location },
    ]

    let bestMatch: { field: string; score: number } | null = null

    for (const { field, value } of locationFields) {
      const score = calculateScore(value, normalizedQuery, 80)
      if (score > 0 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { field, score }
      }
    }

    if (bestMatch) {
      locationResults.push({
        event,
        matchType: "location",
        score: bestMatch.score,
        matchedField: bestMatch.field,
      })
      matchedEventIds.add(event.id)
    }
  }

  // Third pass: category matches
  for (const event of events) {
    if (matchedEventIds.has(event.id)) continue

    const categoryMatch = matchArray(event.categories, normalizedQuery, 70)
    if (categoryMatch) {
      categoryResults.push({
        event,
        matchType: "category",
        score: categoryMatch.score,
        matchedField: "category",
        matchedValue: categoryMatch.value,
      })
      matchedEventIds.add(event.id)
    }
  }

  // Fourth pass: other matches (description only)
  for (const event of events) {
    if (matchedEventIds.has(event.id)) continue

    const descScore = calculateScore(event.description, normalizedQuery, 40)
    if (descScore > 0) {
      otherResults.push({
        event,
        matchType: "other",
        score: descScore,
        matchedField: "description",
      })
    }
  }

  // Sort by score descending and limit results
  const sortByScore = (a: SearchResult, b: SearchResult) => b.score - a.score

  return {
    byName: nameResults.sort(sortByScore).slice(0, opts.maxNameResults),
    byLocation: locationResults.sort(sortByScore).slice(0, opts.maxLocationResults),
    byCategory: categoryResults.sort(sortByScore).slice(0, opts.maxCategoryResults),
    byOther: otherResults.sort(sortByScore).slice(0, opts.maxOtherResults),
  }
}

/**
 * Check if search results have any matches
 */
export function hasResults(results: GroupedSearchResults): boolean {
  return (
    results.byName.length > 0 ||
    results.byLocation.length > 0 ||
    results.byCategory.length > 0 ||
    results.byOther.length > 0
  )
}
