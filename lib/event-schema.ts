import { z } from "zod"

// Valid categories (event format)
export const categories = [
  "conference",
  "hackathon",
  "meetup",
  "coworking",
  "popup-village",
] as const

// Category to color mapping
export const categoryColors: Record<string, string> = {
  conference: "#3B82F6",    // Blue
  hackathon: "#8B5CF6",     // Purple
  meetup: "#10B981",        // Green
  coworking: "#F59E0B",     // Amber
  "popup-village": "#EC4899", // Pink
}

// Category display labels
export const categoryLabels: Record<string, string> = {
  "conference": "Conference",
  "hackathon": "Hackathon",
  "meetup": "Meetup",
  "coworking": "Coworking",
  "popup-village": "Popup Village",
}

// Get color for an event based on first category
export function getEventColor(categories?: string[]): string {
  if (!categories || categories.length === 0) return "#6b7280" // gray
  return categoryColors[categories[0]] || "#6b7280"
}

// Valid continents
export const continents = [
  "africa",
  "asia",
  "europe",
  "north-america",
  "south-america",
  "oceania",
  "global",
] as const

// Location schema
const locationSchema = z
  .object({
    venue: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    continent: z.enum(continents).optional(),
  })
  .optional()

// Social links schema
const socialSchema = z
  .object({
    twitter: z.string().url().optional(),
    telegram: z.string().url().optional(),
    discord: z.string().url().optional(),
    farcaster: z.string().url().optional(),
  })
  .optional()

// Main event schema
export const eventSchema = z
  .object({
    // Required fields
    title: z.string().min(1).max(100),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
    url: z.string().url(),

    // Optional fields
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format")
      .optional(),
    description: z.string().max(500).optional(),
    categories: z.array(z.enum(categories)).max(2).optional(),
    location: locationSchema,
    social: socialSchema,
    tags: z.array(z.string().max(50)).max(10).optional(),
  })
  .refine(
    (data) => {
      if (data.endDate && data.startDate) {
        return data.endDate >= data.startDate
      }
      return true
    },
    { message: "End date must be on or after start date" }
  )

export type YAMLEvent = z.infer<typeof eventSchema>
export type Category = (typeof categories)[number]
export type Continent = (typeof continents)[number]
