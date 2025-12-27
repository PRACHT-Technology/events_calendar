import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Crypto & AI Events 2026'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            marginBottom: 20,
            background: 'linear-gradient(90deg, #00d4ff, #7b2ff7)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Crypto & AI Events
        </div>
        <div
          style={{
            fontSize: 48,
            opacity: 0.9,
          }}
        >
          2026
        </div>
        <div
          style={{
            fontSize: 24,
            marginTop: 40,
            opacity: 0.7,
          }}
        >
          Conferences • Hackathons • Meetups
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
