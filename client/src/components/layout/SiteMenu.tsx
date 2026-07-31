import type { CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Compass,
  Leaf,
  MessageCircle,
  ShoppingBag,
  UserRound,
} from 'lucide-react'
import { menuGroups } from '@/lib/navigation'
import { ROUTES } from '@/routes/paths'
import { contactInfo } from '@/data/stores'
import { cn } from '@utils/index'

type SiteMenuProps = {
  open: boolean
  onClose: () => void
}

const GROUP_ICONS = {
  Shop: ShoppingBag,
  Collections: Leaf,
  Discover: Compass,
  Account: UserRound,
} as const

function MenuLeafMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn('h-3.5 w-3.5 text-[#d4b87a]', className)}
      fill="none"
    >
      <path
        d="M12 20 C8 16 5 11 6 6 C10 7 13 11 14 15 C15 11 18 7 22 6 C21 12 17 17 12 20 Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M12 20 V10" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
    </svg>
  )
}

function CornerBotanical({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 280 320"
      fill="none"
      className={cn('pointer-events-none absolute text-[#d4b87a]', className)}
    >
      <g fill="currentColor" stroke="none" opacity="0.22">
        <path
          d="M40 20 C70 70 95 120 120 175 C140 215 155 255 165 300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.9"
        />
        <path d="M48 35 C62 42 68 58 58 70 C48 58 42 42 48 35Z" />
        <path d="M68 75 C82 70 95 78 92 94 C78 92 66 84 68 75Z" />
        <path d="M88 120 C74 112 62 118 62 134 C76 136 90 128 88 120Z" />
        <path d="M108 165 C122 160 134 170 130 186 C116 182 106 174 108 165Z" />
        <path d="M128 210 C114 202 102 208 102 224 C116 226 130 218 128 210Z" />
        <path d="M145 255 C158 250 168 260 164 274 C150 270 142 262 145 255Z" />
      </g>
    </svg>
  )
}

function FlourishDivider() {
  return (
    <div className="flex items-center gap-4" aria-hidden>
      <span className="h-px flex-1 bg-[#d4b87a]/35" />
      <MenuLeafMark className="h-4 w-4 opacity-90" />
      <span className="h-px flex-1 bg-[#d4b87a]/35" />
    </div>
  )
}

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const PANEL_MS = 820
const BACKDROP_MS = 560

function revealStyle(open: boolean, delayMs: number): CSSProperties {
  return {
    opacity: open ? 1 : 0,
    transform: open ? 'translate3d(0,0,0)' : 'translate3d(-18px, 10px, 0)',
    transition: `opacity ${open ? 620 : 280}ms ${EASE} ${open ? delayMs : 0}ms, transform ${open ? 720 : 280}ms ${EASE} ${open ? delayMs : 0}ms`,
  }
}

export function SiteMenu({ open, onClose }: SiteMenuProps) {
  const navigate = useNavigate()
  const whatsappDigits = contactInfo.whatsapp.replace(/\D/g, '')
  const whatsappHref = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    'Hi Aura of Nature — I’d like help choosing a ritual.',
  )}`

  return (
    <div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      className={cn(
        'fixed inset-0 z-[var(--z-menu)]',
        open ? 'pointer-events-auto visible' : 'pointer-events-none invisible',
      )}
      style={{
        transition: `visibility 0ms linear ${open ? 0 : PANEL_MS}ms`,
      }}
    >
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        className={cn(
          'absolute inset-0 bg-[#0f1611]/50 backdrop-blur-[3px]',
          open ? 'opacity-100' : 'opacity-0',
        )}
        style={{
          transition: `opacity ${BACKDROP_MS}ms ${EASE}, backdrop-filter ${BACKDROP_MS}ms ${EASE}`,
        }}
      />

      <div
        data-lenis-prevent
        className={cn(
          'absolute inset-y-0 left-0 flex h-full w-full max-w-xl flex-col bg-[#1e2a20] text-[#f3ede2] shadow-[0_24px_80px_rgba(8,12,8,0.45)] will-change-transform md:max-w-2xl',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 20% 0%, rgba(212,184,122,0.07), transparent 45%), radial-gradient(ellipse at 90% 80%, rgba(212,184,122,0.05), transparent 40%)',
          transition: `transform ${PANEL_MS}ms ${EASE}`,
        }}
      >
        <CornerBotanical className="-right-4 -top-2 h-[min(42vh,18rem)] w-[min(55%,14rem)] rotate-12" />
        <CornerBotanical className="-bottom-6 -left-8 h-[min(40vh,16rem)] w-[min(50%,13rem)] -scale-x-100 rotate-[-8deg]" />

        <div
          data-lenis-prevent
          className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-[var(--spacing-gutter)] pb-10 pt-32 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Header */}
          <header style={revealStyle(open, 120)}>
            <p className="inline-flex items-center gap-2 text-[0.65rem] font-medium tracking-[0.32em] uppercase text-[#d4b87a]">
              <MenuLeafMark />
              Navigate
            </p>
            <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,2.85rem)] leading-[1.05] tracking-[-0.02em] text-[#f7f1e6]">
              Explore the ritual
            </h2>
            <div className="mt-6 max-w-sm">
              <FlourishDivider />
            </div>
          </header>

          {/* Link columns */}
          <nav
            aria-label="Site navigation"
            className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2"
          >
            {menuGroups.map((group, gi) => {
              const Icon =
                GROUP_ICONS[group.title as keyof typeof GROUP_ICONS] ?? Leaf
              return (
                <div key={group.title} style={revealStyle(open, 180 + gi * 70)}>
                  <p className="mb-4 flex items-center gap-2.5 text-[0.62rem] font-semibold tracking-[0.28em] uppercase text-[#d4b87a]">
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                    {group.title}
                  </p>
                  <ul className="space-y-0">
                    {group.links.map((link) => (
                      <li key={`${group.title}-${link.to}-${link.label}`}>
                        <Link
                          to={link.to}
                          onClick={onClose}
                          tabIndex={open ? 0 : -1}
                          className="group flex items-center justify-between gap-3 border-b border-[#d4b87a]/22 py-2.5 font-display text-[1.25rem] leading-none tracking-wide text-[#f3ede2] transition-colors duration-300 hover:border-[#d4b87a]/70 hover:text-[#d4b87a] sm:text-[1.35rem]"
                        >
                          <span>{link.label}</span>
                          <ArrowRight
                            className="h-3.5 w-3.5 shrink-0 text-[#d4b87a]/55 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-[#d4b87a]"
                            strokeWidth={1.6}
                            aria-hidden
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </nav>

          {/* Bottom bar */}
          <div
            className="mt-10 border-t border-[#d4b87a]/28 pt-7"
            style={revealStyle(open, 480)}
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Chat on WhatsApp"
                  tabIndex={open ? 0 : -1}
                  className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d4b87a]/45 bg-[#f3ede2] text-[#1e2a20] transition hover:scale-105 hover:border-[#d4b87a]"
                >
                  <MessageCircle className="h-5 w-5" strokeWidth={1.6} />
                </a>

                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d4b87a]/55 text-[#d4b87a]"
                    aria-hidden
                  >
                    <Leaf className="h-4 w-4" strokeWidth={1.35} />
                  </span>
                  <p className="font-display text-[0.92rem] leading-snug text-[#e8e0d2]">
                    Handcrafted botanicals. Transparent ingredients. Rituals rooted in
                    nature.
                  </p>
                </div>
              </div>

              <button
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={() => {
                  onClose()
                  navigate(ROUTES.shop)
                }}
                className="group inline-flex h-12 w-fit items-center justify-center gap-2.5 rounded-full border border-[#d4b87a]/75 bg-transparent px-7 text-[0.65rem] font-semibold tracking-[0.26em] uppercase text-[#f3ede2] shadow-[0_0_24px_rgba(212,184,122,0.12)] transition duration-400 hover:border-[#d4b87a] hover:bg-[#d4b87a]/12"
              >
                <MenuLeafMark className="h-3.5 w-3.5" />
                Shop Now
                <ArrowRight
                  className="h-3.5 w-3.5 text-[#d4b87a] transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={1.7}
                  aria-hidden
                />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.68rem] tracking-[0.14em] uppercase text-[#d4b87a]/70">
              <Link
                to={ROUTES.privacy}
                onClick={onClose}
                tabIndex={open ? 0 : -1}
                className="transition hover:text-[#d4b87a]"
              >
                Privacy
              </Link>
              <Link
                to={ROUTES.terms}
                onClick={onClose}
                tabIndex={open ? 0 : -1}
                className="transition hover:text-[#d4b87a]"
              >
                Terms
              </Link>
              <Link
                to={ROUTES.contact}
                onClick={onClose}
                tabIndex={open ? 0 : -1}
                className="transition hover:text-[#d4b87a]"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
