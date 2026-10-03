import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUpRight, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { portfolio, site } from '@/config/site'

export const Route = createFileRoute('/academia/portfolio')({
  head: () => ({ meta: [{ title: `Portfolio · ${site.title}` }] }),
  component: Portfolio,
})

function Portfolio() {
  return (
    <>
      <div className="container-uco pt-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-ink/60">
          <Link to="/academia" className="hover:text-terracotta">Academia</Link>
          <ChevronRight className="size-3.5" /> Portfolio
        </nav>
      </div>
      <PageHeader eyebrow="Selected work" title={<>Portfolio<span className="text-terracotta">.</span></>}>
        A running record of projects, papers, presentations and recognitions.
      </PageHeader>
      <section className="container-uco">
        <ul className="divide-y-2 divide-ink/10 border-y-2 border-ink">
          {portfolio.map((p, i) => {
            const Tag = p.link ? 'a' : 'div'
            return (
              <li key={p.title}>
                <Tag
                  {...(p.link ? { href: p.link, target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group grid gap-2 py-7 transition md:grid-cols-[4rem_1fr_10rem_4rem] md:items-center hover:bg-card"
                >
                  <span className="font-mono text-sm text-ink/40">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="block font-display text-2xl font-semibold md:text-3xl">{p.title}</span>
                    <span className="mt-1 block text-ink/65">{p.description}</span>
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-terracotta">
                    {p.kind} · {p.year}
                  </span>
                  {p.link && <ArrowUpRight className="size-6 justify-self-end transition group-hover:-translate-y-1 group-hover:translate-x-1" />}
                </Tag>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
