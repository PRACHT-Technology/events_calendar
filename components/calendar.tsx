"use client"

import { useState, useMemo, useEffect } from "react"
import { ChevronLeft, ChevronRight, CalendarDays, List, Search, MapPin, Layers, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CalendarEvent } from "@/types/event"
import { EventPopover } from "@/components/event-popover"
import { MiniCalendar } from "@/components/mini-calendar"
import { EventList } from "@/components/event-list"
import { SearchCommand } from "@/components/search-command"
import { EventFilter } from "@/components/event-filter"
import { filterEvents, getLocationOptions, getCategoryOptions, hasActiveFilters } from "@/lib/filters"
import { useIsMobile } from "@/hooks/use-mobile"
import { useFilterParams } from "@/hooks/use-filter-params"
import { motion, AnimatePresence } from "framer-motion"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  parseISO,
  isWithinInterval,
} from "date-fns"
import { cn } from "@/lib/utils"
import { getEventColor, categoryColors } from "@/lib/event-schema"

interface CalendarProps {
  events?: CalendarEvent[]
}

type ViewMode = "1M" | "3M" | "6M"
type DisplayMode = "calendar" | "list"

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const WEEKDAYS_SHORT = ["M", "T", "W", "T", "F", "S", "S"]

export function Calendar({ events = [] }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>("1M")
  const [direction, setDirection] = useState(0)
  const [displayMode, setDisplayMode] = useState<DisplayMode>("list")
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const {
    locationFilter,
    categoryFilter,
    setLocationFilter,
    setCategoryFilter,
    clearAllFilters,
  } = useFilterParams()
  const isMobile = useIsMobile()

  // Filter options derived from events data
  const locationOptions = useMemo(() => getLocationOptions(events), [events])
  const categoryOptions = useMemo(() => getCategoryOptions(), [])

  // Apply filters to events
  const filteredEvents = useMemo(() => {
    return filterEvents(events, {
      locations: locationFilter,
      categories: categoryFilter,
    })
  }, [events, locationFilter, categoryFilter])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const effectiveViewMode = useMemo(() => {
    if (isMobile) {
      return viewMode === "1M" ? "1M" : "3M"
    }
    return viewMode === "1M" ? "1M" : "6M"
  }, [isMobile, viewMode])

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentMonth])

  const numberOfWeeks = Math.ceil(calendarDays.length / 7)

  const monthsToShow = useMemo(() => {
    const count = effectiveViewMode === "6M" ? 6 : effectiveViewMode === "3M" ? 3 : 1
    return Array.from({ length: count }, (_, i) => addMonths(currentMonth, i))
  }, [currentMonth, effectiveViewMode])

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    return filteredEvents.filter((event) => {
      const startDate = parseISO(event.startDate)
      const endDate = event.endDate ? parseISO(event.endDate) : startDate
      if (isSameDay(day, startDate) || isSameDay(day, endDate)) return true
      if (event.endDate) return isWithinInterval(day, { start: startDate, end: endDate })
      return false
    })
  }

  const skipMonths = effectiveViewMode === "6M" ? 6 : effectiveViewMode === "3M" ? 3 : 1

  const goToPrevious = () => {
    setDirection(-1)
    setCurrentMonth(subMonths(currentMonth, skipMonths))
  }

  const goToNext = () => {
    setDirection(1)
    setCurrentMonth(addMonths(currentMonth, skipMonths))
  }

  const goToToday = () => {
    setDirection(0)
    setCurrentMonth(new Date())
  }

  const getTitle = () => {
    if (effectiveViewMode === "1M") return format(currentMonth, "MMMM yyyy")
    const lastMonth = monthsToShow[monthsToShow.length - 1]
    if (currentMonth.getFullYear() === lastMonth.getFullYear()) {
      return `${format(currentMonth, "MMM")} - ${format(lastMonth, "MMM yyyy")}`
    }
    return `${format(currentMonth, "MMM yy")} - ${format(lastMonth, "MMM yy")}`
  }

  const viewOptions = isMobile
    ? [
        { value: "1M", label: "1M" },
        { value: "3M", label: "3M" },
      ]
    : [
        { value: "1M", label: "1M" },
        { value: "6M", label: "6M" },
      ]

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col p-4">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-4 flex-shrink-0"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 }}
      >
        <h2 className="text-base md:text-xl font-medium">{displayMode === "list" ? "Events" : getTitle()}</h2>
        <div className="flex items-center gap-0.5 md:gap-1">
          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="h-7 w-7 md:h-8 md:w-8"
            >
              <Search className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="h-7 md:h-8 px-2 md:px-3 text-xs gap-1.5 bg-transparent"
            >
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Search</span>
              <kbd className="pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-1">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          )}

          <EventFilter
            label="Location"
            icon={<MapPin className="h-3.5 w-3.5" />}
            options={locationOptions}
            selected={locationFilter}
            onSelectionChange={setLocationFilter}
            grouped
          />

          <EventFilter
            label="Category"
            icon={<Layers className="h-3.5 w-3.5" />}
            options={categoryOptions}
            selected={categoryFilter}
            onSelectionChange={setCategoryFilter}
          />

          {hasActiveFilters({ locations: locationFilter, categories: categoryFilter }) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-7 md:h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              <span className="hidden md:inline ml-1">Clear</span>
            </Button>
          )}

          <div className="flex border border-border rounded-md overflow-hidden mr-1 md:mr-2">
            <Button
              variant={displayMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setDisplayMode("list")}
              className="h-7 w-7 md:h-8 md:w-8 rounded-none"
            >
              <List className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
            <Button
              variant={displayMode === "calendar" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setDisplayMode("calendar")}
              className="h-7 w-7 md:h-8 md:w-8 rounded-none border-l border-border"
            >
              <CalendarDays className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          </div>

          {displayMode === "calendar" && (
            <>
              <Select
                value={effectiveViewMode === "3M" && !isMobile ? "6M" : effectiveViewMode}
                onValueChange={(v) => setViewMode(v as ViewMode)}
              >
                <SelectTrigger size="sm" className="w-12 md:w-14 h-7 md:h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {viewOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={goToToday} className="h-7 md:h-8 px-2 md:px-3 text-xs">
                Today
              </Button>
              <Button variant="ghost" size="icon" onClick={goToPrevious} className="h-7 w-7 md:h-8 md:w-8">
                <ChevronLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={goToNext} className="h-7 w-7 md:h-8 md:w-8">
                <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            </>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="wait" initial={false}>
        {displayMode === "list" ? (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
            className="flex-1"
          >
            <EventList events={filteredEvents} />
          </motion.div>
        ) : effectiveViewMode === "1M" ? (
          <motion.div
            key={`1M-${currentMonth.toISOString()}`}
            className="flex-1 flex flex-col"
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-border">
              {(isMobile ? WEEKDAYS_SHORT : WEEKDAYS).map((day, i) => (
                <div key={i} className="py-2 text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            <div
              className="grid grid-cols-7"
              style={{
                gridTemplateRows: `repeat(${numberOfWeeks}, minmax(80px, 1fr))`,
              }}
            >
              {calendarDays.map((day, index) => {
                const dayEvents = getEventsForDay(day)
                const isCurrentMonth = isSameMonth(day, currentMonth)
                const isDayToday = isToday(day)

                return (
                  <motion.div
                    key={day.toISOString()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1, delay: index * 0.002 }}
                    className={cn(
                      "border-b border-r border-border p-1 overflow-hidden flex flex-col",
                      index % 7 === 0 && "border-l",
                      !isCurrentMonth && "bg-muted/30",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center text-sm flex-shrink-0",
                        isDayToday && "rounded-full bg-foreground text-background font-medium",
                        !isCurrentMonth && "text-muted-foreground",
                      )}
                    >
                      {format(day, "d")}
                    </div>

                    <div className="flex flex-col gap-0.5 mt-1 flex-1 overflow-hidden">
                      {dayEvents.slice(0, isMobile ? 1 : 2).map((event) => (
                        <motion.button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.1 }}
                          className="w-full text-left text-[10px] px-1 py-0.5 rounded truncate transition-colors cursor-pointer flex items-center gap-1"
                          style={{
                            backgroundColor: `${getEventColor(event.categories)}20`,
                            borderLeft: `2px solid ${getEventColor(event.categories)}`,
                          }}
                        >
                          <span className="truncate flex-1">{event.title}</span>
                          {event.categories && event.categories.length > 0 && (
                            <span className="flex gap-0.5 flex-shrink-0">
                              {event.categories.slice(0, 2).map((cat) => (
                                <span
                                  key={cat}
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: categoryColors[cat] || "#6b7280" }}
                                  title={cat}
                                />
                              ))}
                            </span>
                          )}
                        </motion.button>
                      ))}
                      {dayEvents.length > (isMobile ? 1 : 2) && (
                        <span className="text-[9px] text-muted-foreground px-1">
                          +{dayEvents.length - (isMobile ? 1 : 2)}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

          </motion.div>
        ) : (
          <motion.div
            key={`multi-${effectiveViewMode}-${currentMonth.toISOString()}`}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "flex-1 grid gap-2 md:gap-4 p-1 md:p-2",
              effectiveViewMode === "3M" && "grid-cols-1 md:grid-cols-3",
              effectiveViewMode === "6M" && "grid-cols-3 grid-rows-2",
            )}
          >
            {monthsToShow.map((month, idx) => (
              <motion.div
                key={month.toISOString()}
                className="flex items-center justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: idx * 0.03 }}
              >
                <MiniCalendar month={month} events={filteredEvents} compact={effectiveViewMode === "6M" || isMobile} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <SearchCommand
        events={filteredEvents}
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelectEvent={(event) => {
          setSearchOpen(false)
          // Small delay to let search dialog close before opening popover
          setTimeout(() => {
            // Navigate to the event's month
            const eventMonth = startOfMonth(parseISO(event.startDate))
            setCurrentMonth(eventMonth)
            setSelectedEvent(event)
          }, 150)
        }}
      />

      {selectedEvent && (
        <EventPopover
          event={selectedEvent}
          open={!!selectedEvent}
          onOpenChange={(open) => !open && setSelectedEvent(null)}
        >
          <span />
        </EventPopover>
      )}
    </div>
  )
}
