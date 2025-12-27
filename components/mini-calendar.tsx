"use client"

import type { CalendarEvent } from "@/types/event"
import { eventTypeColors } from "@/lib/event-schema"
import { EventPopover } from "@/components/event-popover"
import { motion } from "framer-motion"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  parseISO,
  isWithinInterval,
} from "date-fns"

interface MiniCalendarProps {
  month: Date
  events: CalendarEvent[]
  compact?: boolean
}

export function MiniCalendar({ month, events, compact = false }: MiniCalendarProps) {
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  const today = new Date()

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    return events.filter((event) => {
      const eventStart = parseISO(event.startDate)
      const eventEnd = event.endDate ? parseISO(event.endDate) : eventStart
      return (
        isSameDay(day, eventStart) ||
        isSameDay(day, eventEnd) ||
        isWithinInterval(day, { start: eventStart, end: eventEnd })
      )
    })
  }

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"]

  return (
    <div className="flex flex-col">
      <h3 className={`font-medium text-center mb-1 ${compact ? "text-[10px]" : "text-xs"}`}>
        {format(month, "MMM yyyy")}
      </h3>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0">
        {weekDays.map((day, i) => (
          <div
            key={i}
            className={`text-center text-muted-foreground ${compact ? "text-[8px] py-0.5" : "text-[9px] py-1"}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day)
          const isCurrentMonth = isSameMonth(day, month)
          const isDayToday = isSameDay(day, today)

          return (
            <div
              key={day.toISOString()}
              className={`
                relative flex flex-col items-center justify-start
                ${compact ? "h-5 py-0.5" : "h-6 py-1"}
                ${!isCurrentMonth ? "opacity-30" : ""}
              `}
            >
              <span
                className={`
                  ${compact ? "text-[9px] w-4 h-4" : "text-[10px] w-5 h-5"}
                  flex items-center justify-center rounded-full
                  ${isDayToday ? "bg-foreground text-background font-medium" : ""}
                `}
              >
                {format(day, "d")}
              </span>

              {/* Event dots with animation */}
              {dayEvents.length > 0 && isCurrentMonth && (
                <div className={`flex gap-px ${compact ? "mt-0" : "mt-0.5"}`}>
                  {dayEvents.slice(0, 3).map((event) => (
                    <EventPopover key={event.id} event={event}>
                      <motion.button
                        whileHover={{ scale: 1.5 }}
                        whileTap={{ scale: 0.9 }}
                        className={`rounded-full transition-transform ${compact ? "w-1 h-1" : "w-1.5 h-1.5"}`}
                        style={{ backgroundColor: event.type ? eventTypeColors[event.type] || "#6b7280" : "#6b7280" }}
                      />
                    </EventPopover>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
