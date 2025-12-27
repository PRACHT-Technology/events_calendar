import type { CalendarEvent } from "@/types/event"

export const BASE_URL = 'https://events.pracht.tech'

export function generateEventJsonLd(event: CalendarEvent) {
  const isVirtual = event.location?.toLowerCase().includes('virtual') ||
                    event.location?.toLowerCase().includes('online')

  const location = event.location
    ? isVirtual
      ? {
          "@type": "VirtualLocation" as const,
          url: event.url,
        }
      : {
          "@type": "Place" as const,
          name: event.location,
          address: event.location,
        }
    : undefined

  return {
    "@context": "https://schema.org",
    "@type": "Event" as const,
    name: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    url: `${BASE_URL}/event/${event.id}`,
    location,
    organizer: {
      "@type": "Organization" as const,
      name: event.title,
      url: event.url,
    },
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: isVirtual
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
  }
}

export function generateEventsListJsonLd(events: CalendarEvent[]) {
  const itemListElement = events.slice(0, 20).map((event, index) => ({
    "@type": "ListItem" as const,
    position: index + 1,
    item: {
      "@type": "Event" as const,
      name: event.title,
      startDate: event.startDate,
      url: `${BASE_URL}/event/${event.id}`,
    },
  }))

  return {
    "@context": "https://schema.org",
    "@type": "ItemList" as const,
    itemListElement,
  }
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite" as const,
    name: "Crypto & AI Events 2026",
    url: BASE_URL,
    description:
      "Discover and track upcoming cryptocurrency, blockchain, and AI conferences, summits, and meetups worldwide.",
  }
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  const itemListElement = items.map((item, index) => ({
    "@type": "ListItem" as const,
    position: index + 1,
    name: item.name,
    item: item.url,
  }))

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList" as const,
    itemListElement,
  }
}

interface JsonLdProps {
  data: object | object[]
}

export function JsonLd({ data }: JsonLdProps) {
  const jsonLdArray = Array.isArray(data) ? data : [data]

  return (
    <>
      {jsonLdArray.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}
