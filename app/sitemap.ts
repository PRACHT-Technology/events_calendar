import { MetadataRoute } from 'next'
import { loadEvents } from '@/lib/events'

const BASE_URL = 'https://events.pracht.tech'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await loadEvents()

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...events.map((event) => ({
      url: `${BASE_URL}/event/${event.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
