import { Calendar } from "@/components/calendar"
import { sampleEvents } from "@/lib/events"

export default function Page() {
  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-12">
      <Calendar events={sampleEvents} />
    </main>
  )
}
