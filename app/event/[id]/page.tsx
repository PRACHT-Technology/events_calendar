import { notFound } from "next/navigation"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { ArrowLeft, ExternalLink, MapPin, Calendar, Globe, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Metadata } from "next"

import { getEventById, loadEvents } from "@/lib/events"
import { categoryColors, categoryLabels } from "@/lib/event-schema"
import { JsonLd, generateEventJsonLd, generateBreadcrumbJsonLd } from "@/lib/structured-data"

const BASE_URL = 'https://events.pracht.tech'

// Social media icons
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
    </svg>
  )
}

function FarcasterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.24 3.29H5.76a2.47 2.47 0 0 0-2.47 2.47v12.48a2.47 2.47 0 0 0 2.47 2.47h12.48a2.47 2.47 0 0 0 2.47-2.47V5.76a2.47 2.47 0 0 0-2.47-2.47zm-1.41 13.18h-1.76v-4.94c0-1.08-.87-1.96-1.95-1.96s-1.95.88-1.95 1.96v4.94h-1.76v-4.94c0-1.08-.87-1.96-1.95-1.96s-1.95.88-1.95 1.96v4.94H5.76V7.53h1.75v.88a3.46 3.46 0 0 1 2.83-1.47c1.23 0 2.31.64 2.93 1.6a3.46 3.46 0 0 1 2.93-1.6c1.92 0 3.47 1.56 3.47 3.47v6.06h-.84z"/>
    </svg>
  )
}

// Continent display names
const continentLabels: Record<string, string> = {
  "africa": "Africa",
  "asia": "Asia",
  "europe": "Europe",
  "north-america": "North America",
  "south-america": "South America",
  "oceania": "Oceania",
  "global": "Global / Online",
}

function formatDateRange(start: string, end?: string) {
  const startDate = parseISO(start)
  if (!end) return format(startDate, "MMMM d, yyyy")
  const endDate = parseISO(end)
  if (format(startDate, "MMMM yyyy") === format(endDate, "MMMM yyyy")) {
    return `${format(startDate, "MMMM d")} - ${format(endDate, "d, yyyy")}`
  }
  return `${format(startDate, "MMMM d, yyyy")} - ${format(endDate, "MMMM d, yyyy")}`
}

export async function generateStaticParams() {
  const events = await loadEvents()
  return events.map((event) => ({ id: event.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const event = await getEventById(id)

  if (!event) {
    return { title: "Event Not Found" }
  }

  const dateStr = formatDateRange(event.startDate, event.endDate)
  const title = `${event.title} | ${dateStr}`
  const description = event.description || `${event.title} - ${dateStr}. Join this blockchain and crypto event.`

  return {
    title,
    description,
    alternates: { canonical: `/event/${event.id}` },
    openGraph: {
      title: event.title,
      description,
      url: `/event/${event.id}`,
      type: "website",
      siteName: "Crypto & AI Events 2026",
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
    },
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await getEventById(id)

  if (!event) {
    notFound()
  }

  const jsonLdData = [
    generateEventJsonLd(event),
    generateBreadcrumbJsonLd([
      { name: "Home", url: BASE_URL },
      { name: event.title, url: `${BASE_URL}/event/${event.id}` },
    ]),
  ]

  const hasSocialLinks = event.twitterUrl || event.telegramUrl || event.discordUrl || event.farcasterUrl
  const hasCategories = event.categories && event.categories.length > 0

  return (
    <>
      <JsonLd data={jsonLdData} />
      <main className="h-full p-4 md:p-6 lg:p-12">
        <div className="max-w-5xl mx-auto">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Calendar
          </Link>

          {/* Event title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>

          {/* Categories */}
          {hasCategories && (
            <div className="flex flex-wrap gap-2 mb-4">
              {event.categories!.map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: categoryColors[category] || "#6b7280",
                    color: categoryColors[category] || "#6b7280",
                  }}
                >
                  {categoryLabels[category] || category}
                </Badge>
              ))}
            </div>
          )}

          {/* Event meta */}
          <div className="flex flex-col gap-3 mb-6 text-muted-foreground">
            {/* Date */}
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 flex-shrink-0" />
              <time dateTime={event.startDate} className="text-base">
                {formatDateRange(event.startDate, event.endDate)}
              </time>
            </div>

            {/* Location - City & Country */}
            {(event.locationCity || event.locationCountry) && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span className="text-base">
                  {[event.locationCity, event.locationCountry].filter(Boolean).join(", ")}
                </span>
              </div>
            )}

            {/* Venue */}
            {event.locationVenue && (
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 flex-shrink-0" />
                <span className="text-base">{event.locationVenue}</span>
              </div>
            )}

            {/* Continent/Region */}
            {event.locationContinent && (
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 flex-shrink-0" />
                <span className="text-base">
                  {continentLabels[event.locationContinent] || event.locationContinent}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            </div>
          )}

          <Separator className="my-6" />

          {/* Primary action */}
          <div className="mb-6">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href={event.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Event Website
              </a>
            </Button>
          </div>

          {/* Social links */}
          {hasSocialLinks && (
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">Follow & Connect</h2>
              <div className="flex flex-wrap gap-2">
                {event.twitterUrl && (
                  <Button asChild size="sm" variant="outline" className="bg-transparent">
                    <a href={event.twitterUrl} target="_blank" rel="noopener noreferrer">
                      <XIcon className="mr-2 h-4 w-4" />
                      X / Twitter
                    </a>
                  </Button>
                )}
                {event.telegramUrl && (
                  <Button asChild size="sm" variant="outline" className="bg-transparent">
                    <a href={event.telegramUrl} target="_blank" rel="noopener noreferrer">
                      <TelegramIcon className="mr-2 h-4 w-4" />
                      Telegram
                    </a>
                  </Button>
                )}
                {event.discordUrl && (
                  <Button asChild size="sm" variant="outline" className="bg-transparent">
                    <a href={event.discordUrl} target="_blank" rel="noopener noreferrer">
                      <DiscordIcon className="mr-2 h-4 w-4" />
                      Discord
                    </a>
                  </Button>
                )}
                {event.farcasterUrl && (
                  <Button asChild size="sm" variant="outline" className="bg-transparent">
                    <a href={event.farcasterUrl} target="_blank" rel="noopener noreferrer">
                      <FarcasterIcon className="mr-2 h-4 w-4" />
                      Farcaster
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
