export interface CalendarEvent {
  id: string
  title: string
  startDate: string // ISO date string (YYYY-MM-DD)
  endDate?: string // ISO date string for multi-day events
  description?: string
  url: string // link to event homepage
  location?: string // formatted string for display

  // Structured location for search/display
  locationCity?: string
  locationCountry?: string
  locationVenue?: string
  locationContinent?: string

  // Social links
  twitterUrl?: string
  telegramUrl?: string
  discordUrl?: string
  farcasterUrl?: string

  // Searchable metadata
  categories?: string[] // event format: conference, hackathon, meetup, coworking, popup-village (max 2)
}
