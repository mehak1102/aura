import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { FlaskConical, Heart, Leaf } from 'lucide-react'
import { ROUTES } from '@/routes/paths'

type AuthShellProps = {
  eyebrow: string
  title: string
  description?: string
  children: ReactNode
}

const BADGES = [
  { icon: Leaf, line1: '100%', line2: 'Pure & Natural' },
  { icon: FlaskConical, line1: 'Clean', line2: 'Formulas' },
  { icon: Heart, line1: 'People &', line2: 'Planet Friendly' },
]

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <div className="relative min-h-[100svh] bg-[#f6f1e8]">
      {/* Full-bleed brand artwork: botanical half, wavy gold divider, cream panel */}
      <div
        className="absolute inset-0 hidden bg-cover bg-center lg:block"
        style={{ backgroundImage: "url('/auth/auth-bg.jpg')" }}
        aria-hidden
      />

      {/* Darkening scrim for text legibility — full-bleed and faded to fully
          transparent before the wave, so it never shows a hard vertical edge. */}
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            'linear-gradient(90deg, rgba(8,14,9,0.72) 0%, rgba(10,17,11,0.5) 22%, rgba(12,20,13,0.12) 40%, rgba(12,20,13,0) 46%)',
        }}
        aria-hidden
      />

      {/* ── Left — copy over the botanical half ── */}
      <aside className="absolute inset-y-0 left-0 hidden w-[48%] xl:w-[52%] lg:block">
        <div className="relative z-10 flex h-full max-w-[22rem] flex-col justify-between p-8 xl:max-w-[30rem] xl:p-16">
          <Link
            to={ROUTES.home}
            className="inline-flex items-center gap-3 self-start"
            aria-label="Aura of Nature home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c2a378]/55">
              <Leaf className="h-4 w-4 text-[#c2a378]" strokeWidth={1.5} aria-hidden />
            </span>
            <span className="text-[0.68rem] font-medium tracking-[0.32em] text-[#c2a378] uppercase">
              Aura of Nature
            </span>
          </Link>

          <div className="max-w-md">
            <p className="text-[0.62rem] font-medium tracking-[0.38em] text-[#c2a378]/80 uppercase">
              Aura of Nature
            </p>
            <h2 className="font-display mt-4 text-[clamp(2.5rem,3.6vw,3.6rem)] leading-[1.06] text-warm-white">
              We Care for
              <br />
              What You <span className="text-[#c2a378]">Believe In.</span>
            </h2>

            <div className="mt-6 flex items-center gap-3" aria-hidden>
              <span className="h-px w-14 bg-[#c2a378]/45" />
              <Leaf className="h-3.5 w-3.5 text-[#c2a378]/80" strokeWidth={1.5} />
              <span className="h-px w-14 bg-[#c2a378]/45" />
            </div>

            <p className="mt-6 text-[0.95rem] font-light text-warm-white/85">
              Pure rituals. Natural care. Meaningful living.
            </p>
            <p className="mt-2 max-w-sm text-[0.86rem] leading-relaxed font-light text-warm-white/60">
              Handpicked botanicals for your everyday well-being. Because nature heals, always.
            </p>
          </div>

          <div>
            <ul className="flex flex-wrap items-center gap-5 xl:gap-9">
              {BADGES.map(({ icon: Icon, line1, line2 }) => (
                <li key={line2} className="flex flex-col items-center text-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c2a378]/45 backdrop-blur-[2px] xl:h-12 xl:w-12">
                    <Icon className="h-4 w-4 text-[#c2a378] xl:h-5 xl:w-5" strokeWidth={1.4} aria-hidden />
                  </span>
                  <span className="mt-2 text-[0.6rem] font-semibold tracking-[0.06em] text-warm-white/90 xl:mt-2.5 xl:text-[0.64rem]">
                    {line1}
                  </span>
                  <span className="text-[0.54rem] font-light tracking-[0.04em] text-warm-white/60 xl:text-[0.58rem]">
                    {line2}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex items-center gap-3" aria-hidden>
              <span className="h-px w-8 bg-warm-white/25" />
              <span className="text-[0.56rem] font-medium tracking-[0.3em] text-warm-white/50 uppercase">
                Pure · Natural · Nourishing
              </span>
              <span className="h-px flex-1 bg-warm-white/25" />
            </div>
          </div>
        </div>
      </aside>

      {/* ── Right — form over the cream panel ── */}
      <section className="relative flex min-h-[100svh] items-center justify-center px-[var(--spacing-gutter)] py-20 lg:ml-[48%] xl:ml-[52%]">
        <div className="relative w-full max-w-[min(24rem,100%)]">
          <div className="mb-3 flex items-center gap-3">
            <p className="text-[0.64rem] font-medium tracking-[0.3em] text-[#b8975c] uppercase">
              {eyebrow}
            </p>
            <span className="h-px w-12 bg-[#c4a35a]/55" aria-hidden />
            <Leaf className="h-3.5 w-3.5 text-[#c2a378]/70" strokeWidth={1.5} aria-hidden />
          </div>

          <h1 className="font-display text-[clamp(2.6rem,3vw,3.4rem)] leading-[1.05] text-forest">
            {title}
          </h1>
          {description && (
            <p className="mt-3 text-[0.9rem] font-light text-charcoal/60">
              {description}
            </p>
          )}

          <div className="mt-9">{children}</div>
        </div>
      </section>
    </div>
  )
}
