import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import BeachDetail from '@/components/BeachDetail'
import type { BeachWithData } from '@/types/beach'
import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

async function getBeach(id: string): Promise<BeachWithData | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) return null

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: beach } = await supabase
    .from('beaches')
    .select('*')
    .eq('id', id)
    .single()

  if (!beach) return null

  const [{ data: photos }, { data: rating }] = await Promise.all([
    supabase.from('beach_photos').select('*').eq('beach_id', id).order('photo_index'),
    supabase.from('beach_ratings').select('*').eq('beach_id', id).single(),
  ])

  return {
    ...beach,
    photos: photos ?? [],
    rating: rating ?? null,
  } as BeachWithData
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
