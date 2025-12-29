"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, parseISO, addMonths, startOfMonth, isBefore, isAfter } from "date-fns"
import { ExternalLink, Copy, Check } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import type { CalendarEvent } from "@/types/event"
import { cn } from "@/lib/utils"
import { EventPopover } from "@/components/event-popover"
import { getEventColor, categoryColors } from "@/lib/event-schema"

interface EventListProps {
  events: CalendarEvent[]
}

interface GroupedEvents {
  [monthKey: string]: {
    label: string
    events: CalendarEvent[]
  }
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function EventList({ events }: EventListProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const groupedEvents = useMemo(() => {
    const groups: GroupedEvents = {}
    const now = new Date()
    const startMonth = startOfMonth(now)
    const endMonth = startOfMonth(addMonths(now, 11))

    const filteredEvents = events.filter((event) => {
      const eventDate = parseISO(event.startDate)
      const eventMonth = startOfMonth(eventDate)
      return !isBefore(eventMonth, startMonth) && !isAfter(eventMonth, endMonth)
    })

    const sortedEvents = [...filteredEvents].sort(
      (a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime(),
    )

    sortedEvents.forEach((event) => {
      const date = parseISO(event.startDate)
      const monthKey = format(date, "yyyy-MM")
      const label = format(date, "MMMM yyyy")

      if (!groups[monthKey]) {
        groups[monthKey] = { label, events: [] }
      }
      groups[monthKey].events.push(event)
    })

    return groups
  }, [events])

  const monthKeys = Object.keys(groupedEvents).sort()

  const formatDateCompact = (start: string, end?: string) => {
    const startDate = parseISO(start)
    if (!end) return format(startDate, "MMM d")
    const endDate = parseISO(end)
    if (format(startDate, "MMM") === format(endDate, "MMM")) {
      return `${format(startDate, "d")}-${format(endDate, "d")} ${format(startDate, "MMM")}`
    }
    return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`
  }

  const handleCopy = async (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(event.url)
    setCopiedId(event.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      {monthKeys.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">No events to display</div>
      ) : (
        <Accordion type="multiple" defaultValue={[]} className="w-full">
          {monthKeys.map((monthKey, idx) => {
            const { label, events: monthEvents } = groupedEvents[monthKey]
            return (
              <motion.div
                key={monthKey}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1, delay: idx * 0.02 }}
              >
                <AccordionItem value={monthKey} className="border-b border-border">
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs">{label}</span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                        {monthEvents.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pb-2">
                      <div className="hidden md:grid grid-cols-[1fr_100px_120px_auto] gap-2 px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wide border-b border-border/50">
                        <span>Event</span>
                        <span>Date</span>
                        <span>Location</span>
                        <span className="text-center">Links</span>
                      </div>
                      {/* Grid rows */}
                      <AnimatePresence>
                        {monthEvents.map((event, eventIdx) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.08, delay: eventIdx * 0.015 }}
                          >
                            <div
                              onClick={() => setSelectedEvent(event)}
                              className={cn(
                                "hidden md:grid grid-cols-[1fr_100px_120px_auto] gap-2 px-2 py-1.5 items-center cursor-pointer",
                                "hover:bg-muted/50 transition-colors text-xs",
                                "border-b border-border/30 last:border-0",
                              )}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: getEventColor(event.categories) }}
                                />
                                <span className="truncate font-medium">{event.title}</span>
                                {event.categories?.slice(0, 2).map((cat) => (
                                  <Badge
                                    key={cat}
                                    variant="outline"
                                    className="text-[9px] px-1.5 py-0 h-4 flex-shrink-0"
                                    style={{
                                      borderColor: categoryColors[cat] || "#6b7280",
                                      color: categoryColors[cat] || "#6b7280",
                                    }}
                                  >
                                    {cat}
                                  </Badge>
                                ))}
                              </div>
                              <span className="text-muted-foreground whitespace-nowrap">
                                {formatDateCompact(event.startDate, event.endDate)}
                              </span>
                              <span className="text-muted-foreground truncate">{event.location || "—"}</span>
                              <div className="flex items-center gap-1 justify-center">
                                {event.twitterUrl && (
                                  <a
                                    href={event.twitterUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-1 hover:bg-muted rounded transition-colors"
                                    title="Twitter/X"
                                  >
                                    <XIcon className="h-3 w-3" />
                                  </a>
                                )}
                                <a
                                  href={event.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-1 hover:bg-muted rounded transition-colors"
                                  title="Website"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                                <button
                                  onClick={(e) => handleCopy(e, event)}
                                  className="p-1 hover:bg-muted rounded transition-colors"
                                  title="Copy link"
                                >
                                  {copiedId === event.id ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <div
                              onClick={() => setSelectedEvent(event)}
                              className={cn(
                                "md:hidden flex flex-col gap-1 px-2 py-2 cursor-pointer",
                                "hover:bg-muted/50 transition-colors text-xs",
                                "border-b border-border/30 last:border-0",
                              )}
                            >
                              {/* Row 1: Event name */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: getEventColor(event.categories) }}
                                />
                                <span className="font-medium">{event.title}</span>
                                {event.categories?.slice(0, 2).map((cat) => (
                                  <Badge
                                    key={cat}
                                    variant="outline"
                                    className="text-[9px] px-1.5 py-0 h-4 flex-shrink-0"
                                    style={{
                                      borderColor: categoryColors[cat] || "#6b7280",
                                      color: categoryColors[cat] || "#6b7280",
                                    }}
                                  >
                                    {cat}
                                  </Badge>
                                ))}
                              </div>
                              {/* Row 2: Date, Location, Links */}
                              <div className="flex items-center justify-between pl-4">
                                <div className="flex items-center gap-3 text-muted-foreground">
                                  <span className="whitespace-nowrap">
                                    {formatDateCompact(event.startDate, event.endDate)}
                                  </span>
                                  {event.location && (
                                    <>
                                      <span className="text-border">•</span>
                                      <span className="truncate max-w-[120px]">{event.location}</span>
                                    </>
                                  )}
                                </div>
                                <div className="flex items-center gap-0.5">
                                  {event.twitterUrl && (
                                    <a
                                      href={event.twitterUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="p-1.5 hover:bg-muted rounded transition-colors"
                                      title="Twitter/X"
                                    >
                                      <XIcon className="h-3.5 w-3.5" />
                                    </a>
                                  )}
                                  <a
                                    href={event.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-1.5 hover:bg-muted rounded transition-colors"
                                    title="Website"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                  <button
                                    onClick={(e) => handleCopy(e, event)}
                                    className="p-1.5 hover:bg-muted rounded transition-colors"
                                    title="Copy link"
                                  >
                                    {copiedId === event.id ? (
                                      <Check className="h-3.5 w-3.5 text-green-500" />
                                    ) : (
                                      <Copy className="h-3.5 w-3.5" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            )
          })}
        </Accordion>
      )}

      {selectedEvent && (
        <EventPopover
          event={selectedEvent}
          open={!!selectedEvent}
          onOpenChange={(open) => !open && setSelectedEvent(null)}
        >
          <span />
        </EventPopover>
      )}
    </motion.div>
  )
}
