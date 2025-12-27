import { NextResponse } from "next/server"
import { loadEvents } from "@/lib/events"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get("year")
  const month = searchParams.get("month")

  let events = await loadEvents()

  // Filter by year/month if provided
  if (year) {
    events = events.filter((event) => {
      const eventDate = new Date(event.startDate)
      const matchesYear = eventDate.getFullYear() === parseInt(year)
      if (month) {
        return matchesYear && eventDate.getMonth() + 1 === parseInt(month)
      }
      return matchesYear
    })
  }

  return NextResponse.json({ events, count: events.length })
}
