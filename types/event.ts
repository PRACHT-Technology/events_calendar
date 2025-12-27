export interface CalendarEvent {
  id: string
  title: string
  startDate: string // ISO date string (YYYY-MM-DD)
  endDate?: string // ISO date string for multi-day events
  description?: string
  url: string // link to event homepage
  color?: string // optional accent color
  location?: string
  twitterUrl?: string
}
