import type { ReactNode } from 'react'
import { Eyebrow, Display, Body } from '@components/ui'

type AuthShellProps = {
  eyebrow: string
  title: string
  description?: string
  children: ReactNode
}

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <div className="relative grid min-h-[100svh] lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-forest lg:block">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 30% 20%, rgba(184,151,92,0.25), transparent 55%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(90,107,72,0.4), transparent 50%), linear-gradient(160deg, #1a261c, #243528 50%, #3d4f3a)',
          }}
        />
        <div className="grain absolute inset-0" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-warm-white xl:p-16">
          <Eyebrow tone="gold">Aura of Nature</Eyebrow>
          <div>
            <Display as="h2" size="lg" className="max-w-md text-warm-white">
              Rituals begin with belonging.
            </Display>
            <Body className="mt-5 max-w-sm text-warm-white/70">
              Your account keeps wishlist, orders, and preferred botanicals in one calm place.
            </Body>
          </div>
          <p className="text-micro text-warm-white/45">Pure · Natural · Nourishing</p>
        </div>
      </aside>

      <section className="relative flex items-center justify-center px-[var(--spacing-gutter)] py-28">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 50% 40% at 90% 10%, rgba(184,151,92,0.1), transparent 60%)',
          }}
        />
        <div className="w-full max-w-md">
          <Eyebrow tone="olive">{eyebrow}</Eyebrow>
          <Display as="h1" size="md" className="mt-3 text-forest">
            {title}
          </Display>
          {description && (
            <Body muted className="mt-3">
              {description}
            </Body>
          )}
          <div className="mt-10">{children}</div>
        </div>
      </section>
    </div>
  )
}
