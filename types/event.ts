export interface CalendarEvent {
  id: string
  title: string
  startDate: string // ISO date string (YYYY-MM-DD)
  endDate?: string // ISO date string for multi-day events
  description?: string
  url: string // link to event homepage
  color?: string // optional accent color
  location?: string // formatted string for display
  twitterUrl?: string

  // Structured location for search
  locationCity?: string
  locationCountry?: string
  locationVenue?: string
  locationContinent?: string

  // Searchable metadata
  type?: string // "conference" | "hackathon" | etc.
  categories?: string[] // ["ethereum", "defi", ...]
  tags?: string[] // custom tags
}
