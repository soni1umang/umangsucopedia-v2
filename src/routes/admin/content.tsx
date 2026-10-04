import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Save, RotateCcw } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useIdentity } from '@/lib/identity-context'
import { saveContent } from '@/lib/content'
import { about, academia, portfolio, sideHustles, albums, paintings } from '@/config/site'

type Key = 'about' | 'academia' | 'portfolio' | 'side_hustles' | 'photography' | 'paintings'
const defaults: Record<Key, unknown> = { about, academia, portfolio, side_hustles: sideHustles, photography: albums, paintings }
const labels: Record<Key, string> = { about: 'About me', academia: 'Academia', portfolio: 'Academic portfolio', side_hustles: 'Other projects / side hustles', photography: 'Photography', paintings: 'Paints' }

export const Route = createFileRoute('/admin/content')({ component: ContentManager })

function ContentManager() {
  const { user, ready } = useIdentity()
  const [admin, setAdmin] = useState(false)
  const [active, setActive] = useState<Key>('portfolio')
  const [text, setText] = useState('')
  const [saved, setSaved] = useState<Record<Key, unknown>>({})
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function load() {
    if (!user) return
    setLoading(true); setError('')
    const adminResult = await supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle()
    if (adminResult.error) { setError(adminResult.error.message); setLoading(false); return }
    if (!adminResult.data) { setError('Your account does not have owner/admin access.'); setLoading(false); return }
    setAdmin(true)
    const result = await supabase.from('site_content').select('key,content').order('key')
    if (result.error) { setError('The content table is not ready yet. Run supabase/migration_v2_content.sql in Supabase SQL Editor first. (' + result.error.message + ')'); setLoading(false); return }
    const map: Record<string, unknown> = {}
    for (const row of result.data ?? []) map[row.key] = row.content
    setSaved(map as Record<Key, unknown>); setLoading(false)
  }

  useEffect(() => { if (ready) void load() }, [ready, user])

  useEffect(() => {
    const value = saved[active] ?? defaults[active]
    setText(JSON.stringify(value, null, 2)); setNotice(''); setError('')
  }, [active, saved])

  const parsed = useMemo(() => { try { return JSON.parse(text) } catch { return null } }, [text])

  async function save() {
    setError(''); setNotice('')
    if (parsed === null) { setError('The JSON is not valid. Fix the syntax before saving.'); return }
    setBusy(true)
    try { await saveContent(active, parsed); setSaved(current => ({ ...current, [active]: parsed })); setNotice(labels[active] + ' saved.') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save content.') }
    finally { setBusy(false) }
  }

  if (!ready || loading) return <section className="container-uco py-20">Loading content manager…</section>
  if (!user || !admin) return <section className="container-uco py-20"><h1 className="font-display text-4xl font-semibold">Owner access required<span className="text-terracotta">.</span></h1><Link to="/login" className="btn-ink mt-6">Login</Link></section>

  return (
    <section className="container-uco py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><Link to="/admin" className="text-sm text-ink/60 hover:text-terracotta">← Dashboard</Link><p className="eyebrow mt-5">Site content</p><h1 className="mt-2 font-display text-5xl font-semibold">Content manager<span className="text-terracotta">.</span></h1><p className="mt-3 max-w-2xl text-ink/65">Edit the sections outside the blog without touching the code. Lists, links, image paths and descriptions can all be changed here.</p></div>
        <button onClick={() => void save()} disabled={busy || parsed === null} className="btn-saffron"><Save className="size-4" /> {busy ? 'Saving…' : 'Save changes'}</button>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[15rem_1fr]">
        <nav className="rounded-2xl border border-ink/15 bg-card p-2">
          {(Object.keys(labels) as Key[]).map(key => <button key={key} onClick={() => setActive(key)} className={'block w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ' + (active === key ? 'bg-ink text-paper' : 'hover:bg-paper-deep')}>{labels[key]}</button>)}
        </nav>
        <div className="rounded-2xl border border-ink/15 bg-card p-5 md:p-6">
          <div className="flex items-center justify-between gap-4"><div><h2 className="text-2xl font-semibold">{labels[active]}</h2><p className="mt-1 text-sm text-ink/55">Structured JSON — edit text, add/remove items, and change image paths.</p></div><button className="btn-ghost !px-3 !py-2 text-xs" onClick={() => setText(JSON.stringify(defaults[active], null, 2))}><RotateCcw className="size-3.5" /> Reset editor</button></div>
          <textarea className="field mt-5 min-h-[38rem] resize-y font-mono text-sm leading-6" value={text} onChange={e => setText(e.target.value)} spellCheck={false} />
          {error && <p className="mt-4 rounded-lg bg-terracotta/10 px-4 py-3 text-sm text-terracotta">{error}</p>}
          {notice && <p className="mt-4 rounded-lg bg-saffron/40 px-4 py-3 text-sm">{notice}</p>}
          <div className="mt-5 rounded-xl bg-paper p-4 text-sm text-ink/70"><strong>Tip:</strong> Keep JSON quotes and commas valid. For images, use paths such as <code>/img/kerala-1.jpg</code> or a full Supabase/public URL.</div>
        </div>
      </div>
    </section>
  )
}