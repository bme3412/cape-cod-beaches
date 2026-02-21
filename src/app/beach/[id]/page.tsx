import { notFound } from 'next/navigation'
import BeachDetail from '@/components/BeachDetail'
import type { BeachWithData } from '@/types/beach'
import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

async function getBeach(id: string): Promise<BeachWithData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/beaches`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) return null
  const beaches: BeachWithData[] = await res.json()
  return beaches.find((b) => b.id === id) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const beach = await getBeach(params.id)
  if (!beach) return { title: 'Beach Not Found' }

  const photo = beach.photos[0]
  return {
    title: `${beach.name} — Cape Cod Beach Guide`,
    description: beach.description,
    openGraph: {
      title: beach.name,
      description: beach.description,
      images: photo ? [{ url: photo.storage_url }] : [],
    },
  }
}

export default async function BeachPage({ params }: Props) {
  const beach = await getBeach(params.id)
  if (!beach) notFound()

  return <BeachDetail beach={beach} />
}
