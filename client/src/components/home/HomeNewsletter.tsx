import { useState, type FormEvent } from 'react'
import { ArrowUpRight, Mail } from 'lucide-react'
import { useGsap, revealOnScroll } from '@animations/gsap'
import { cn } from '@utils/index'

export function HomeNewsletter() {
  const [email, setEmail] = useState('')
  const [focused, setFocused] = useState(false)

  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-reveal]'))
  }, [])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
  }

  return (
    <section ref={scope} className="relative overflow-hidden">
      <div
        className="relative isolate overflow-hidden px-5 py-16 sm:px-8 sm:py-20 md:py-24"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 35%, #243528 0%, #1a261c 55%, #121a14 100%)',
        }}
      >
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <div data-reveal="" className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#b8975c]/70 sm:w-12" />
              <span className="h-1.5 w-1.5 rotate-45 border border-[#b8975c]/80" aria-hidden />
              <p className="text-[0.65rem] font-semibold tracking-[0.28em] text-[#b8975c] uppercase">
                Newsletter
              </p>
              <span className="h-1.5 w-1.5 rotate-45 border border-[#b8975c]/80" aria-hidden />
              <span className="h-px w-8 bg-[#b8975c]/70 sm:w-12" />
            </div>
          </div>

          <h2
            data-reveal=""
            className="mt-5 font-display text-[clamp(1.75rem,4.2vw,2.75rem)] leading-[1.12] tracking-[-0.02em] text-[#f3ebe0]"
          >
            Seasonal notes & early releases
          </h2>

          <p
            data-reveal=""
            className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#c8c2b6]/80 sm:text-[0.95rem]"
          >
            Join the Aura circle for botanical stories and first access to limited batches.
          </p>

          <form
            data-reveal=""
            onSubmit={onSubmit}
            className="mx-auto mt-9 flex w-full max-w-lg flex-col items-stretch gap-3 sm:flex-row sm:items-end sm:gap-3"
          >
            <div className="min-w-0 flex-1 text-left">
              <label
                htmlFor="aura-newsletter-email"
                className="mb-2 block text-[0.65rem] font-semibold tracking-[0.22em] text-[#b8975c] uppercase"
              >
                Email
              </label>
              <div
                className={cn(
                  'flex h-12 items-center gap-2.5 rounded-full border bg-[#152019]/85 px-4 transition',
                  focused ? 'border-[#b8975c]/90' : 'border-[#b8975c]/45',
                )}
              >
                <Mail className="h-4 w-4 shrink-0 text-[#b8975c]/85" strokeWidth={1.6} aria-hidden />
                <input
                  id="aura-newsletter-email"
                  name="newsletter"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className="h-full w-full min-w-0 bg-transparent text-sm text-[#f3ebe0] outline-none focus:outline-none focus-visible:outline-none placeholder:text-[#8a9288]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="group relative inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-[#b8975c]/80 bg-[#0a0c0a] px-7 text-[0.68rem] font-semibold tracking-[0.22em] text-[#b8975c] uppercase transition hover:border-[#d4b87a] hover:text-[#d4b87a] sm:mb-0"
            >
              Subscribe
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2}
                aria-hidden
              />
              <span
                className="pointer-events-none absolute -bottom-2 left-1/2 h-3 w-2/3 -translate-x-1/2 rounded-full opacity-70 blur-md"
                style={{
                  background:
                    'radial-gradient(ellipse, rgba(184,151,92,0.55), transparent 70%)',
                }}
              />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
