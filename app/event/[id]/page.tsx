import { notFound } from "next/navigation"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { ArrowLeft, ExternalLink, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

import { sampleEvents } from "@/lib/events"

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
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

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = sampleEvents.find((e) => e.id === id)

  if (!event) {
    notFound()
  }

  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-12">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Calendar
        </Link>

        {/* Color bar */}
        <div className="w-full h-2 rounded-full mb-6" style={{ backgroundColor: event.color || "#3b82f6" }} />

        {/* Event title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>

        {/* Event meta */}
        <div className="flex flex-col gap-2 mb-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span className="text-base">{formatDateRange(event.startDate, event.endDate)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="text-base">{event.location}</span>
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

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="flex-1">
            <a href={event.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Event Website
            </a>
          </Button>
          {event.twitterUrl && (
            <Button asChild size="lg" variant="outline" className="flex-1 bg-transparent">
              <a href={event.twitterUrl} target="_blank" rel="noopener noreferrer">
                <XIcon className="mr-2 h-4 w-4" />
                Follow on X
              </a>
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}
