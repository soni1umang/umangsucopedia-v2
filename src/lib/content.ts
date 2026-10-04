import { supabase } from './supabase'

export type AboutContent = {
  headline: string
  intro: string
  paragraphs: string[]
  facts: { label: string; value: string }[]
  interests: string[]
}

export type AcademiaContent = {
  intro: string
  education: { school: string; degree: string; period: string; note: string }[]
  interests: string[]
}

export type PortfolioItem = {
  title: string
  kind: string
  year: string
  description: string
  link: string
}

export type SideHustleItem = {
  title: string
  status: string
  description: string
  link: string
}

export type Photo = { src: string; caption: string }

export type Album = {
  slug: string
  title: string
  summary: string
  cover: string
  photos: Photo[]
}

export type Painting = {
  src: string
  title: string
  medium: string
  year: string
  caption: string
}

export async function getContent<T>(key: string, fallback: T): Promise<T> {
  const { data, error } = await supabase
    .from('site_content')
    .select('content')
    .eq('key', key)
    .maybeSingle()

  // Keep the public site usable even before the one-time content migration SQL
  // has been run.
  if (error || !data?.content) return fallback
  return data.content as T
}

export async function getContentRow(key: string) {
  const { data, error } = await supabase
    .from('site_content')
    .select('key,content,updated_at')
    .eq('key', key)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function saveContent(key: string, content: unknown) {
  const { data, error } = await supabase
    .from('site_content')
    .upsert(
      { key, content, updated_at: new Date().toISOString() },
      { onConflict: 'key' },
    )
    .select()
    .single()

  if (error) throw error
  return data
}
