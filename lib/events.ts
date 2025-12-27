import fs from "fs"
import path from "path"
import { parse } from "yaml"
import { eventSchema, type YAMLEvent } from "./event-schema"
import type { CalendarEvent } from "@/types/event"

/**
 * Derives event ID from filename
 * e.g., "2026-02-17_ethdenver.yaml" -> "2026-02-17_ethdenver"
 */
function deriveIdFromFilename(filename: string): string {
  return filename.replace(/\.yaml$/, "")
}

/**
 * Formats location object into a single string
 */
function formatLocation(location?: YAMLEvent["location"]): string | undefined {
  if (!location) return undefined
  const parts = [location.venue, location.city, location.country].filter(Boolean)
  return parts.length > 0 ? parts.join(", ") : undefined
}

/**
 * Loads and parses all YAML event files from the events directory
 */
export async function loadEvents(): Promise<CalendarEvent[]> {
  const eventsDir = path.join(process.cwd(), "events")
  const events: CalendarEvent[] = []

  // Check if events directory exists
  if (!fs.existsSync(eventsDir)) {
    console.warn("Events directory not found:", eventsDir)
    return []
  }

  // Get all year directories (folders named with 4 digits)
  const entries = fs.readdirSync(eventsDir, { withFileTypes: true })
  const years = entries
    .filter((entry) => entry.isDirectory() && /^\d{4}$/.test(entry.name))
    .map((entry) => entry.name)
    .sort()

  for (const year of years) {
    const yearDir = path.join(eventsDir, year)
    const files = fs.readdirSync(yearDir).filter((f) => f.endsWith(".yaml")).sort()

    for (const file of files) {
      const filePath = path.join(yearDir, file)

      try {
        const content = fs.readFileSync(filePath, "utf-8")
        const rawEvent = parse(content)

        // Validate with Zod
        const result = eventSchema.safeParse(rawEvent)
        if (!result.success) {
          console.error(`Invalid event file: ${filePath}`)
          console.error(result.error.issues)
          continue // Skip invalid files
        }

        const yamlEvent = result.data
        const id = deriveIdFromFilename(file)

        // Transform to CalendarEvent
        const event: CalendarEvent = {
          id,
          title: yamlEvent.title,
          startDate: yamlEvent.startDate,
          endDate: yamlEvent.endDate,
          description: yamlEvent.description,
          url: yamlEvent.url,
          location: formatLocation(yamlEvent.location),
          twitterUrl: yamlEvent.social?.twitter,

          // Structured location for search
          locationCity: yamlEvent.location?.city,
          locationCountry: yamlEvent.location?.country,
          locationVenue: yamlEvent.location?.venue,
          locationContinent: yamlEvent.location?.continent,

          // Searchable metadata
          type: yamlEvent.type,
          categories: yamlEvent.categories,
          tags: yamlEvent.tags,
        }

        events.push(event)
      } catch (error) {
        console.error(`Error parsing event file: ${filePath}`, error)
        continue
      }
    }
  }

  // Sort by start date
  return events.sort((a, b) => a.startDate.localeCompare(b.startDate))
}

/**
 * Gets a single event by ID
 */
export async function getEventById(id: string): Promise<CalendarEvent | undefined> {
  const events = await loadEvents()
  return events.find((event) => event.id === id)
}
