import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Cape Cod Beach Guide',
    template: '%s — Cape Cod Beach Guide',
  },
  description: 'A curated guide to the best beaches on Cape Cod, MA.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
