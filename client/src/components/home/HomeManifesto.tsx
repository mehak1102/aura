import { Link } from 'react-router-dom'
import { manifestoContent } from '@/data/home'
import { useGsap, revealOnScroll } from '@animations/gsap'

export function HomeManifesto() {
  const { lines, body, watermark, cta } = manifestoContent

  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-reveal]'))
  }, [])

  return (
    <section
      ref={scope}
      className="relative overflow-hidden bg-charcoal text-warm-white"
    >
      <div className="relative mx-auto flex min-h-[70vh] max-w-[90rem] flex-col items-center justify-center px-[var(--spacing-gutter)] py-[var(--spacing-section)] text-center md:min-h-[78vh]">
        <h2
          data-reveal=""
          className="font-display max-w-4xl text-[clamp(2rem,5.5vw,4.25rem)] leading-[1.05] tracking-tight uppercase"
        >
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <p
          data-reveal=""
          className="mt-8 max-w-md text-micro tracking-[0.12em] leading-relaxed text-warm-white/55 md:mt-10"
        >
          {body}
        </p>

        <Link
          data-reveal=""
          to={cta.to}
          className="mt-8 inline-flex items-center rounded-full border border-warm-white/50 px-7 py-2.5 text-micro tracking-[0.22em] uppercase text-warm-white transition-colors duration-300 hover:border-soft-gold hover:text-soft-gold"
        >
          {cta.label}
        </Link>

        <p
          aria-hidden
          data-reveal=""
          className="pointer-events-none mt-14 font-display text-[clamp(2.75rem,10vw,7.5rem)] leading-[0.9] tracking-tight uppercase text-warm-white/[0.08] select-none md:mt-20"
        >
          {watermark.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
