"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import type { CalendarEvent } from "@/types/event"
import { Button } from "@/components/ui/button"
import { ExternalLink, X, MapPin, Calendar, ArrowRight } from "lucide-react"
import { format, parseISO } from "date-fns"

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

interface EventPopoverProps {
  event: CalendarEvent
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function EventPopover({ event, children, open = false, onOpenChange }: EventPopoverProps) {
  const router = useRouter()

  const startDate = parseISO(event.startDate)
  const endDate = event.endDate ? parseISO(event.endDate) : null

  const formatDateRange = () => {
    if (!endDate || event.startDate === event.endDate) {
      return format(startDate, "MMM d, yyyy")
    }
    if (startDate.getMonth() === endDate.getMonth()) {
      return `${format(startDate, "MMM d")} - ${format(endDate, "d, yyyy")}`
    }
    return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange?.(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, onOpenChange])

  return (
    <>
      {/* Trigger */}
      <div onClick={() => onOpenChange?.(!open)} className="cursor-pointer">
        {children}
      </div>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
              onClick={() => onOpenChange?.(false)}
            />

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md bg-popover border border-border rounded-lg shadow-xl p-5"
            >
              {/* Close button */}
              <button
                onClick={() => onOpenChange?.(false)}
                className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>

              <div className="flex flex-col gap-4 pr-6">
                {/* Color bar */}
                <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: event.color || "#3b82f6" }} />

                <div>
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <div className="flex flex-col gap-1.5 mt-3">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDateRange()}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>

                {event.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                )}

                <div className="flex flex-col gap-2 mt-2">
                  <Button
                    size="default"
                    variant="default"
                    className="w-full"
                    onClick={() => router.push(`/event/${event.id}`)}
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <div className="flex gap-2">
                    <Button asChild size="default" variant="outline" className="flex-1 bg-transparent">
                      <a href={event.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Website
                      </a>
                    </Button>
                    {event.twitterUrl && (
                      <Button asChild size="default" variant="outline" className="flex-1 bg-transparent">
                        <a href={event.twitterUrl} target="_blank" rel="noopener noreferrer">
                          <XIcon className="mr-2 h-4 w-4" />
                          Twitter
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
