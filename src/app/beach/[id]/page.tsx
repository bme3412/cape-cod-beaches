import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import BeachDetail from '@/components/BeachDetail'
import BeachCard from '@/components/BeachCard'
import type { BeachWithData } from '@/types/beach'
import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key)
}

async function getBeach(id: string): Promise<BeachWithData | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null
  const supabase = getSupabase()

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

  return { ...beach, photos: photos ?? [], rating: rating ?? null } as BeachWithData
}

async function getRelatedBeaches(beach: BeachWithData): Promise<BeachWithData[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  const supabase = getSupabase()

  // Find beaches sharing the most best_for tags, same region preferred
  const { data: candidates } = await supabase
    .from('beaches')
    .select('*')
    .eq('is_active', true)
    .neq('id', beach.id)
    .limit(60)

  if (!candidates?.length) return []

  const beachIds = candidates.map((b) => b.id)
  const [{ data: photos }, { data: ratings }] = await Promise.all([
    supabase.from('beach_photos').select('*').in('beach_id', beachIds).eq('photo_index', 0),
    supabase.from('beach_ratings').select('*').in('beach_id', beachIds),
  ])

  type PhotoRow = NonNullable<typeof photos>[0]
  type RatingRow = NonNullable<typeof ratings>[0]

  const photoById: Record<string, PhotoRow> = {}
  for (const p of photos ?? []) photoById[p.beach_id] = p

  const ratingById: Record<string, RatingRow> = {}
  for (const r of ratings ?? []) ratingById[r.beach_id] = r

  const beachRegion = (beach as BeachWithData & { region?: string }).region

  const scored = candidates.map((b) => {
    const sharedTags = b.best_for.filter((t: string) => (beach.best_for as string[]).includes(t)).length
    const sameRegion = (b as typeof b & { region?: string }).region === beachRegion ? 1 : 0
    return {
      beach: { ...b, photos: photoById[b.id] ? [photoById[b.id]] : [], rating: ratingById[b.id] ?? null } as BeachWithData,
      score: sharedTags * 2 + sameRegion,
    }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.beach)
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

  const related = await getRelatedBeaches(beach)

  return (
    <>
      <BeachDetail beach={beach} />

      {related.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 pb-16">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-display text-xl font-semibold text-stone-700">
              You might also like
            </h2>
            <div className="flex-1 h-px bg-stone-200" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map((r) => (
              <BeachCard key={r.id} beach={r} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
