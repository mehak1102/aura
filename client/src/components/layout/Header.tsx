import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, Search, ShoppingBag, User } from 'lucide-react'
import { HiOutlineMenuAlt2, HiOutlineX } from 'react-icons/hi'
import { Logo } from '@components/ui'
import { useAuth } from '@contexts/AuthContext'
import { useCart } from '@contexts/CartContext'
import { useWishlist } from '@contexts/WishlistContext'
import { ROUTES } from '@/routes/paths'
import { pauseLenis, resumeLenis } from '@/lib/lenisControl'
import { cn } from '@utils/index'
import { SiteMenu } from './SiteMenu'
import { PredictiveSearch } from './PredictiveSearch'

type HeaderProps = {
  transparent?: boolean
}

/** Primary header links — same on every page */
const headerNav = [
  { label: 'Shop', to: ROUTES.shop },
  { label: 'Ingredients', to: ROUTES.ingredients },
  { label: 'Our Story', to: ROUTES.ourStory },
  { label: 'Contact', to: ROUTES.contact },
] as const

function NavIcon({
  to,
  label,
  light = false,
  children,
}: {
  to: string
  label: string
  light?: boolean
  children: ReactNode
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center transition-opacity duration-300 hover:opacity-65 md:h-10 md:w-10"
      style={{
        color: light ? '#faf8f4' : '#0c0f0c',
        filter: light
          ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.35))'
          : 'drop-shadow(0 0 1px rgba(248,245,238,0.95))',
      }}
    >
      {children}
    </Link>
  )
}

export function Header({ transparent = false }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const { count } = useCart()
  const { count: wishCount } = useWishlist()
  const isHome = location.pathname === ROUTES.home
  /** All pages except home use solid forest nav */
  const isForestNav = !isHome

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    if (menuOpen) {
      pauseLenis()
      return () => {
        document.body.style.overflow = ''
        resumeLenis()
      }
    }

    const t = window.setTimeout(() => resumeLenis(), 850)
    return () => {
      document.body.style.overflow = ''
      window.clearTimeout(t)
      resumeLenis()
    }
  }, [menuOpen])

  const isHomeInverse =
    !isForestNav && (isHome || transparent) && !scrolled && !menuOpen
  const isLightChrome = isForestNav || isHomeInverse

  const chrome = isLightChrome ? 'text-[#faf8f4]' : 'text-[#0c0f0c]'
  const chromeLift = isLightChrome
    ? 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]'
    : 'drop-shadow-[0_0_1.2px_rgba(248,245,238,0.9)]'
  const iconColor = isLightChrome ? '#faf8f4' : '#0c0f0c'

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 transition-colors duration-300',
          menuOpen ? 'z-[calc(var(--z-menu)+1)]' : 'z-[var(--z-header)]',
          isForestNav
            ? 'border-b border-warm-white/10 bg-[#1b261e]'
            : scrolled || menuOpen
              ? 'border-b border-[#1b261e]/10 bg-[#F8F5EE]'
              : 'bg-transparent',
        )}
      >
        <div className="relative z-50 mx-auto flex h-[4.25rem] max-w-[86rem] items-center justify-between px-[var(--spacing-gutter)] font-nav md:h-[4.75rem]">
          <div className="relative z-50 flex min-w-0 shrink-0 items-center gap-4 md:gap-6 xl:min-w-[7rem] xl:gap-7">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className={cn(
                'group flex items-center gap-2.5 text-[0.72rem] font-semibold tracking-[0.2em] uppercase transition-opacity hover:opacity-65',
                chrome,
                chromeLift,
              )}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
            >
              {menuOpen ? (
                <HiOutlineX className="h-5 w-5" aria-hidden />
              ) : (
                <HiOutlineMenuAlt2 className="h-5 w-5" aria-hidden />
              )}
              <span className="hidden sm:inline">{menuOpen ? 'Close' : 'Menu'}</span>
            </button>

            <nav
              className={cn(
                'relative z-50 hidden items-center gap-4 xl:flex xl:gap-6',
                chrome,
                chromeLift,
              )}
              aria-label="Primary"
            >
              {headerNav.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-current transition-opacity hover:opacity-65"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <Logo
            tone={isLightChrome ? 'gold' : 'dark'}
            editorial
            className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
          />

          <div className="relative z-50 flex min-w-0 shrink-0 items-center justify-end gap-0 md:gap-0.5">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center transition-opacity duration-300 hover:opacity-65 md:h-10 md:w-10"
              style={{
                color: iconColor,
                filter: isLightChrome
                  ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.35))'
                  : 'drop-shadow(0 0 1px rgba(248,245,238,0.95))',
              }}
            >
              <Search className="h-[1.1rem] w-[1.1rem]" stroke="currentColor" strokeWidth={1.85} />
            </button>
            <NavIcon
              to={isAuthenticated ? ROUTES.account : ROUTES.login}
              label={isAuthenticated ? 'Account' : 'Sign in'}
              light={isLightChrome}
            >
              <User className="h-[1.1rem] w-[1.1rem]" stroke="currentColor" strokeWidth={1.85} />
            </NavIcon>
            <NavIcon to={ROUTES.wishlist} label="Wishlist" light={isLightChrome}>
              <span className="relative" style={{ color: iconColor }}>
                <Heart className="h-[1.1rem] w-[1.1rem]" stroke="currentColor" strokeWidth={1.85} />
                {wishCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#b8975c] px-1 text-[0.5rem] text-[#1b261e]">
                    {wishCount > 99 ? '99+' : wishCount}
                  </span>
                )}
              </span>
            </NavIcon>
            <NavIcon to={ROUTES.cart} label="Cart" light={isLightChrome}>
              <span className="relative" style={{ color: iconColor }}>
                <ShoppingBag className="h-[1.1rem] w-[1.1rem]" stroke="currentColor" strokeWidth={1.85} />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#b8975c] px-1 text-[0.5rem] text-[#1b261e]">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </span>
            </NavIcon>
          </div>
        </div>

        {/* Mobile / tablet primary links — same labels as desktop */}
        <nav
          aria-label="Primary mobile"
          className={cn(
            'relative z-50 border-t xl:hidden',
            isLightChrome ? 'border-warm-white/10' : 'border-[#1b261e]/8',
          )}
        >
          <div
            className={cn(
              'mx-auto flex max-w-[86rem] items-center justify-start gap-5 overflow-x-auto px-[var(--spacing-gutter)] py-2.5 font-nav [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-6 sm:justify-center [&::-webkit-scrollbar]:hidden',
              chrome,
              chromeLift,
            )}
          >
            {headerNav.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="shrink-0 text-[0.62rem] font-semibold tracking-[0.18em] uppercase text-current transition-opacity hover:opacity-65 sm:text-[0.68rem]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <SiteMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <PredictiveSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
