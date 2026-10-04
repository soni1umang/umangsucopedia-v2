import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, GraduationCap } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { academia, site } from '@/config/site'
import { getContent, type AcademiaContent } from '@/lib/content'

export const Route = createFileRoute('/academia/')({
  loader: () => getContent<AcademiaContent>('academia', academia),
  head: () => ({ meta: [{ title: `Academia · ${site.title}` }] }),
  component: Academia,
})

function Academia() {
  const data = Route.useLoaderData()
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
          <Link to="/academia/portfolio" className="group flex items-center justify-between rounded-2xl border-2 border-ink bg-saffron p-6 transition hover:shadow-[6px_6px_0_var(--color-ink)]">
            <span><span className="block font-display text-2xl font-semibold">Portfolio</span><span className="text-sm text-ink/75">Projects, papers, talks &amp; awards</span></span>
            <ArrowRight className="size-6 transition group-hover:translate-x-1" />
          </Link>
        </aside>
      </section>
    </>
  )
}
