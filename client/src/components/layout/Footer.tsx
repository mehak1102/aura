import { Link } from 'react-router-dom'
import { Instagram } from 'lucide-react'
import { Body, Display, Eyebrow, Input, Logo, Button } from '@components/ui'
import { footerGroups } from '@/lib/navigation'

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-charcoal/10 bg-forest text-warm-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 20% 0%, rgba(184,151,92,0.22), transparent 60%), radial-gradient(ellipse 50% 40% at 90% 100%, rgba(90,107,72,0.35), transparent 55%)',
        }}
      />

      <div className="relative mx-auto max-w-[var(--spacing-content)] px-[var(--spacing-gutter)] py-16 md:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Eyebrow tone="gold">Stay close</Eyebrow>
            <Display as="h2" size="lg" className="mt-4 max-w-md text-warm-white">
              Rituals, stories &amp; seasonal releases.
            </Display>
            <Body size="sm" className="mt-4 max-w-sm text-warm-white/70">
              Join the Aura circle for early access to botanicals and editorial notes from the atelier.
            </Body>

            <form
              className="mt-8 flex max-w-md flex-col gap-4 sm:flex-row sm:items-end"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex-1 [&_label]:text-warm-white/60 [&_input]:border-warm-white/25 [&_input]:text-warm-white [&_input]:placeholder:text-warm-white/40 [&_input]:focus:border-soft-gold">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@email.com"
                  autoComplete="email"
                />
              </div>
              <Button type="submit" variant="gold" size="md">
                Subscribe
              </Button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-4 text-micro text-soft-gold">{group.title}</p>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm font-light text-warm-white/75 transition-colors hover:text-warm-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-8 border-t border-warm-white/10 pt-8 md:flex-row md:items-end md:justify-between">
          <Logo tone="light" className="items-start" />

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://www.instagram.com/auraofnatureofficial/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-micro tracking-[0.22em] uppercase text-warm-white/80 transition-colors hover:text-warm-white"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.5} />
              @auraofnatureofficial
            </a>
            <p className="text-micro text-warm-white/45">
              © {new Date().getFullYear()} Aura of Nature
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
