import { Outlet, useLocation } from 'react-router-dom'
import {
  Header,
  Footer,
  SiteInstagram,
  SmoothScroll,
  ScrollTriggerRefresh,
  ScrollToTop,
  BackToTop,
  ScrollProgress,
  WhatsAppFloat,
  PageTransition,
} from '@components/layout'
import { CartToast } from '@components/cart/CartToast'
import { QuickViewProvider } from '@components/shop/QuickView'
import { ErrorBoundary } from '@components/ErrorBoundary'
import { ROUTES } from '@/routes/paths'

const TRANSPARENT_ROUTES = new Set<string>([])
const AUTH_ROUTES = new Set<string>([
  ROUTES.login,
  ROUTES.register,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
])

export function RootLayout() {
  const { pathname } = useLocation()
  const transparentHeader = TRANSPARENT_ROUTES.has(pathname)
  const isAuthPage = AUTH_ROUTES.has(pathname)

  return (
    <SmoothScroll>
      <ScrollToTop />
      <ScrollTriggerRefresh />
      <QuickViewProvider>
        <div className="relative flex min-h-screen flex-col text-charcoal">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-forest focus:px-4 focus:py-2 focus:text-sm focus:text-warm-white"
          >
            Skip to content
          </a>
          <PageTransition />
          {!isAuthPage && <ScrollProgress />}
          {!isAuthPage && <Header transparent={transparentHeader} />}
          <main id="main-content" className="flex-1" tabIndex={-1}>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
          {!isAuthPage && <SiteInstagram />}
          {!isAuthPage && <Footer />}
          {!isAuthPage && <CartToast />}
          {!isAuthPage && <BackToTop />}
          {!isAuthPage && <WhatsAppFloat />}
        </div>
      </QuickViewProvider>
    </SmoothScroll>
  )
}
