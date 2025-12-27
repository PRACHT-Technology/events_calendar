import { Calendar } from "@/components/calendar"
import { loadEvents } from "@/lib/events"

export default async function Page() {
  const events = await loadEvents()

  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-12">
      <Calendar events={events} />
    </main>
  )
}
