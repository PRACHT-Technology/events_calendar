import type { Metadata } from "next"
import { Calendar } from "@/components/calendar"
import { loadEvents } from "@/lib/events"
import { JsonLd, generateWebsiteJsonLd, generateEventsListJsonLd } from "@/lib/structured-data"

export const metadata: Metadata = {
  title: "Crypto & AI Events Calendar 2026 | Conferences, Hackathons & Meetups",
  description: "Browse 50+ upcoming blockchain, Ethereum, Solana, and AI events for 2026. Find conferences like ETHDenver, Devcon, Consensus, hackathons, and meetups worldwide.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Crypto & AI Events Calendar 2026 | Conferences, Hackathons & Meetups",
    description: "Browse 50+ upcoming blockchain, Ethereum, Solana, and AI events for 2026. Find conferences like ETHDenver, Devcon, Consensus, hackathons, and meetups worldwide.",
    url: "/",
    type: "website",
  },
}

export default async function Page() {
  const events = await loadEvents()
  const jsonLdData = [generateWebsiteJsonLd(), generateEventsListJsonLd(events)]

  return (
    <>
      <JsonLd data={jsonLdData} />
      <main className="p-4 md:p-6 lg:p-12">
        <Calendar events={events} />
      </main>
    </>
  )
}
