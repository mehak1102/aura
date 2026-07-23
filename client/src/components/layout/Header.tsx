import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, Moon, Search, ShoppingBag, Sun, User } from 'lucide-react'
import { HiOutlineMenuAlt2, HiOutlineX } from 'react-icons/hi'
import { Logo } from '@components/ui'
import { useAuth } from '@contexts/AuthContext'
import { useCart } from '@contexts/CartContext'
import { useWishlist } from '@contexts/WishlistContext'
import { useTheme } from '@contexts/ThemeContext'
import { ROUTES } from '@/routes/paths'
import { primaryNav } from '@/lib/navigation'
import { cn } from '@utils/index'
import { SiteMenu } from './SiteMenu'
import { PredictiveSearch } from './PredictiveSearch'

type HeaderProps = {
  transparent?: boolean
}

/** Home hero chrome — matches the portal mockup nav */
const homeHeroNav = [
  { label: 'Shop', to: ROUTES.shop },
  { label: 'Ingredients', to: ROUTES.ingredients },
  { label: 'Our Story', to: ROUTES.ourStory },
  { label: 'Contact', to: ROUTES.contact },
] as const

function NavIcon({
  to,
  label,
  inverse = false,
  children,
}: {
  to: string
  label: string
  inverse?: boolean
  children: ReactNode
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center transition-opacity duration-300 hover:opacity-60"
      style={{
        color: inverse ? '#ffffff' : '#0c0f0c',
        filter: inverse
          ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.45))'
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
  const { theme, toggleTheme } = useTheme()
  const isHome = location.pathname === ROUTES.home

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
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const isInverse = (transparent || isHome) && !scrolled && !menuOpen
  const chrome = isInverse ? 'text-[#faf8f4]' : 'text-[#0c0f0c]'
  const chromeLift = isInverse
    ? 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]'
    : 'drop-shadow-[0_0_1.2px_rgba(248,245,238,0.9)]'
  const iconColor = isInverse ? '#ffffff' : '#0c0f0c'

  const navLinks = isHome ? homeHeroNav : primaryNav.slice(0, 5)

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[var(--z-header)] transition-colors duration-300',
          scrolled || menuOpen
            ? 'border-b border-[#1b261e]/10 bg-[#F8F5EE]'
            : 'bg-transparent',
        )}
      >
        <div
          className="relative z-50 mx-auto flex h-16 max-w-[86rem] items-center justify-between px-[var(--spacing-gutter)] font-nav md:h-[4.5rem]"
        >
          <div className="relative z-50 flex min-w-[5.5rem] items-center gap-7 md:min-w-[7rem] md:gap-8">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className={cn(
                'group flex items-center gap-3 text-[0.78rem] font-semibold tracking-[0.22em] uppercase transition-opacity hover:opacity-60',
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
                'relative z-50 hidden items-center gap-5 md:flex xl:gap-7',
                chrome,
                chromeLift,
              )}
              aria-label="Primary"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-[0.75rem] font-semibold tracking-[0.2em] uppercase text-current transition-opacity hover:opacity-60"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <Logo
            tone={isInverse ? 'gold' : 'dark'}
            editorial={isHome}
            className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
          />

          <div className="relative z-50 flex min-w-[5.5rem] items-center justify-end gap-0.5 md:min-w-[7rem]">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center transition-opacity duration-300 hover:opacity-60"
              style={{
                color: iconColor,
                filter: isInverse
                  ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.45))'
                  : 'drop-shadow(0 0 1px rgba(248,245,238,0.95))',
              }}
            >
              <Search className="h-[1.15rem] w-[1.15rem]" stroke="currentColor" strokeWidth={1.85} />
            </button>
            {!isHome && (
              <button
                type="button"
                aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                onClick={toggleTheme}
                className="hidden h-10 w-10 items-center justify-center transition-opacity hover:opacity-60 lg:inline-flex"
                style={{ color: iconColor }}
              >
                {theme === 'dark' ? (
                  <Sun className="h-[1.15rem] w-[1.15rem]" stroke="currentColor" strokeWidth={1.85} />
                ) : (
                  <Moon className="h-[1.15rem] w-[1.15rem]" stroke="currentColor" strokeWidth={1.85} />
                )}
              </button>
            )}
            <NavIcon
              to={isAuthenticated ? ROUTES.account : ROUTES.login}
              label={isAuthenticated ? 'Account' : 'Sign in'}
              inverse={isInverse}
            >
              <User className="h-[1.15rem] w-[1.15rem]" stroke="currentColor" strokeWidth={1.85} />
            </NavIcon>
            {!isHome && (
              <span className="hidden sm:inline-flex">
                <NavIcon
                  to={isAuthenticated ? ROUTES.wishlist : ROUTES.login}
                  label="Wishlist"
                  inverse={isInverse}
                >
                  <span className="relative">
                    <Heart className="h-[1.15rem] w-[1.15rem]" stroke="currentColor" strokeWidth={1.85} />
                    {wishCount > 0 && isAuthenticated && (
                      <span className="absolute -right-2 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#b8975c] px-1 text-[0.5rem] text-[#1b261e]">
                        {wishCount > 99 ? '99+' : wishCount}
                      </span>
                    )}
                  </span>
                </NavIcon>
              </span>
            )}
            <NavIcon to={ROUTES.cart} label="Cart" inverse={isInverse}>
              <span className="relative" style={{ color: iconColor }}>
                <ShoppingBag className="h-[1.15rem] w-[1.15rem]" stroke="currentColor" strokeWidth={1.85} />
                {count > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#b8975c] px-1 text-[0.5rem] text-[#1b261e]">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </span>
            </NavIcon>
          </div>
        </div>
      </header>

      <SiteMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <PredictiveSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
