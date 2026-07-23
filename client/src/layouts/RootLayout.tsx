import { Outlet, useLocation } from 'react-router-dom'
import {
  Header,
  Footer,
  SmoothScroll,
  ScrollTriggerRefresh,
  ScrollToTop,
  ScrollProgress,
  WhatsAppFloat,
  PageTransition,
} from '@components/layout'
import { CartToast } from '@components/cart/CartToast'
import { QuickViewProvider } from '@components/shop/QuickView'
import { ROUTES } from '@/routes/paths'

const TRANSPARENT_ROUTES = new Set<string>([])
const AUTH_ROUTES = new Set<string>([
  ROUTES.login,
  ROUTES.register,
  ROUTES.forgotPassword,
])

export function RootLayout() {
  const { pathname } = useLocation()
  const transparentHeader = TRANSPARENT_ROUTES.has(pathname)
  const isAuthPage = AUTH_ROUTES.has(pathname)

  return (
    <SmoothScroll>
      <ScrollTriggerRefresh />
      <QuickViewProvider>
        <div className="relative flex min-h-screen flex-col text-charcoal">
          <PageTransition />
          {!isAuthPage && <ScrollProgress />}
          {!isAuthPage && <Header transparent={transparentHeader} />}
          <main className="flex-1">
            <Outlet />
          </main>
          {!isAuthPage && <Footer />}
          {!isAuthPage && <CartToast />}
          {!isAuthPage && <ScrollToTop />}
          {!isAuthPage && <WhatsAppFloat />}
        </div>
      </QuickViewProvider>
    </SmoothScroll>
  )
}
