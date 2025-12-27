import { z } from "zod"

// Valid event types
export const eventTypes = [
  "conference",
  "hackathon",
  "meetup",
  "popup-village",
  "festival",
  "workshop",
  "summit",
] as const

// Valid categories
export const categories = [
  "ethereum",
  "solana",
  "bitcoin",
  "blockchain",
  "ai",
  "defi",
  "privacy",
  "institutional",
  "developer",
  "zk",
  "web3",
  "rwa",
] as const

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

// Event type to color mapping
export const eventTypeColors: Record<string, string> = {
  conference: "#3B82F6",      // Blue
  hackathon: "#8B5CF6",       // Purple
  meetup: "#10B981",          // Green
  "popup-village": "#F59E0B", // Amber
  festival: "#EC4899",        // Pink
  workshop: "#06B6D4",        // Cyan
  summit: "#6366F1",          // Indigo
}

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
    type: z.enum(eventTypes).optional(),
    categories: z.array(z.enum(categories)).optional(),
    location: locationSchema,
    attendance: z.string().optional(),
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
export type EventType = (typeof eventTypes)[number]
export type Category = (typeof categories)[number]
export type Continent = (typeof continents)[number]
