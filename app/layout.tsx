import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Footer } from "@/components/footer";

const fontSans = JetBrains_Mono({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL('https://events.pracht.tech'),
  title: {
    default: "Crypto & AI Events 2026",
    template: "%s | Crypto & AI Events 2026",
  },
  description: "Discover blockchain, Ethereum, Solana, and AI conferences, hackathons, and meetups worldwide.",
  keywords: [
    "crypto events",
    "blockchain conferences",
    "ethereum events",
    "solana events",
    "AI conferences",
    "web3 events",
    "hackathons",
    "crypto meetups",
    "DeFi events",
    "NFT conferences",
  ],
  openGraph: {
    siteName: "Crypto & AI Events 2026",
    images: [
      {
        url: "/og-image.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontSans.variable}>
      <body className="antialiased h-screen overflow-hidden">
        <NuqsAdapter>
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
            <Footer />
          </div>
          <Toaster />
        </NuqsAdapter>
      </body>
    </html>
  );
}
