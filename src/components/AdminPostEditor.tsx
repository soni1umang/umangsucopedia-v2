import { useState } from 'react'

export function Editor({ id }: { id?: number }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  return (
    <section className="container-uco py-10">
      <h1 className="font-display text-4xl font-semibold">
        {id ? 'Edit post' : 'New post'}
        <span className="text-terracotta">.</span>
      </h1>

      <div className="mt-8 max-w-4xl space-y-5 rounded-2xl border border-ink/15 bg-card p-6">
        <label className="label">
          Title
          <input
            className="field mt-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="label">
          Content
          <textarea
            className="field mt-2 min-h-[30rem] font-mono text-sm"
            placeholder="Write Markdown here…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>

        <p className="text-sm text-ink/55">
          Diagnostic editor — title and content are local only for this test.
        </p>
      </div>
    </section>
  )
}
