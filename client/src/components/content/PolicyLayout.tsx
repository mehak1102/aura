import type { PolicyDocument } from '@/data/legal'
import { Body, Display } from '@components/ui'
import { EditorialHero } from './EditorialHero'

type PolicyLayoutProps = {
  policy: PolicyDocument
}

export function PolicyLayout({ policy }: PolicyLayoutProps) {
  return (
    <main className="pb-24">
      <EditorialHero
        eyebrow="Legal"
        title={policy.title}
        description={`Last updated ${policy.lastUpdated}`}
      />

      <section className="container-aura mt-16 max-w-3xl">
        <Body muted className="text-lg leading-relaxed">
          {policy.intro}
        </Body>

        <div className="mt-14 space-y-12">
          {policy.sections.map((section) => (
            <article key={section.heading}>
              <Display as="h2" size="sm" className="text-forest">
                {section.heading}
              </Display>
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((p) => (
                  <Body key={p.slice(0, 40)} muted>
                    {p}
                  </Body>
                ))}
              </div>
              {section.list && (
                <ul className="mt-4 space-y-2">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-body font-light text-charcoal-muted"
                    >
                      <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-soft-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
