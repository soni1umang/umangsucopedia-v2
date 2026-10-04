import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, BookOpen, GraduationCap, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { academia, publications as fallbackPublications, site } from '@/config/site'
import { getContent, type AcademiaContent, type PublicationItem } from '@/lib/content'

export const Route = createFileRoute('/academia/')({
  loader: async () => {
    const [data, pubs] = await Promise.all([
      getContent<AcademiaContent>('academia', academia),
      getContent<PublicationItem[]>('publications', fallbackPublications),
    ])
    return { data, pubs }
  },
  head: () => ({ meta: [{ title: `Academia · ${site.title}` }] }),
  component: Academia,
})

function Academia() {
  const { data, pubs } = Route.useLoaderData()
  const featured = pubs.find((p) => p.featured) ?? pubs[0]
  return (
    <>
      <PageHeader eyebrow="Academia" title={<>Learning, <span className="italic text-terracotta">formally</span>.</>}>
        {data.intro}
      </PageHeader>
      <section className="container-uco grid gap-10 md:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="text-2xl font-semibold">Education</h2>
          <ol className="relative mt-6 space-y-8 border-l-2 border-dashed border-ink/20 pl-8">
            {data.education.map((e, i) => (
              <li key={e.school + i} className="relative">
                <span className="absolute -left-[2.6rem] grid size-8 place-items-center rounded-full border-2 border-ink bg-saffron"><GraduationCap className="size-4" /></span>
                <p className="font-mono text-xs uppercase tracking-widest text-terracotta">{e.period}</p>
                <h3 className="mt-1 text-2xl font-semibold">{e.school}</h3>
                <p className="font-medium text-ink/80">{e.degree}</p>
                <p className="mt-2 text-ink/65">{e.note}</p>
              </li>
            ))}
          </ol>
        </div>
        <aside className="space-y-6">
          <div className="rounded-2xl border border-ink/10 bg-card p-6">
            <h2 className="text-xl font-semibold">Research interests</h2>
            <ul className="mt-4 space-y-2 text-ink/75">
              {data.interests.map((i) => <li key={i} className="flex gap-2"><span className="text-terracotta">✦</span>{i}</li>)}
            </ul>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link to="/academia/portfolio" className="group flex items-center justify-between rounded-2xl border-2 border-ink bg-saffron p-6 transition hover:shadow-[6px_6px_0_var(--color-ink)]">
              <span><span className="block font-display text-2xl font-semibold">Academic work</span><span className="text-sm text-ink/75">Projects, talks, awards &amp; more</span></span>
              <ArrowRight className="size-6 transition group-hover:translate-x-1" />
            </Link>
            <Link to="/academia/publications" className="group flex items-center justify-between rounded-2xl border-2 border-ink bg-ink p-6 text-paper transition hover:shadow-[6px_6px_0_var(--color-saffron)]">
              <span><span className="flex items-center gap-2 font-display text-2xl font-semibold"><BookOpen className="size-5 text-saffron"/>Publications</span><span className="text-sm text-paper/65">{pubs.length ? pubs.length + ' ' + (pubs.length === 1 ? 'paper' : 'papers') + ' in the record' : 'Your papers, beautifully archived'}</span></span>
              <ArrowRight className="size-6 text-saffron transition group-hover:translate-x-1" />
            </Link>
          </div>
        </aside>
      </section>

      {featured && (
        <section className="container-uco pt-16">
          <div className="relative overflow-hidden rounded-[2rem] border-2 border-ink bg-card p-7 md:p-9">
            <div className="absolute right-0 top-0 size-48 rounded-full bg-saffron/20 blur-3xl" />
            <div className="relative grid gap-6 md:grid-cols-[8rem_1fr_auto] md:items-center">
              <div className="grid size-28 place-items-center rounded-2xl border border-ink/10 bg-paper">
                <Sparkles className="size-8 text-terracotta" />
              </div>
              <div>
                <p className="eyebrow">Featured publication</p>
                <h2 className="mt-2 font-display text-2xl font-semibold">{featured.title}</h2>
                <p className="mt-2 text-sm text-ink/55">{featured.journal}{featured.year ? ' · ' + featured.year : ''}</p>
              </div>
              <Link to="/academia/publications" className="btn-ghost">Explore publications <ArrowRight className="size-4"/></Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
