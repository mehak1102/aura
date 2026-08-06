import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'
import { RootLayout } from '@layouts/RootLayout'
import { GuestRoute, ProtectedRoute } from '@components/auth/ProtectedRoute'
const HomePage = lazy(() => import('@pages/home/HomePage'))

const OurStoryPage = lazy(() => import('@pages/about/OurStoryPage'))
const IngredientsPage = lazy(() => import('@pages/about/IngredientsPage'))
const IngredientDetailPage = lazy(() => import('@pages/about/IngredientDetailPage'))
const GiftSetsPage = lazy(() => import('@pages/collections/GiftSetsPage'))
const ShopPage = lazy(() => import('@pages/shop/ShopPage'))
const SkinCarePage = lazy(() => import('@pages/shop/SkinCarePage'))
const BodyCarePage = lazy(() => import('@pages/shop/BodyCarePage'))
const HairCarePage = lazy(() => import('@pages/shop/HairCarePage'))
const EssentialOilsPage = lazy(() => import('@pages/shop/EssentialOilsPage'))
const ColdPressedOilsPage = lazy(() => import('@pages/shop/ColdPressedOilsPage'))
const BestSellersPage = lazy(() => import('@pages/shop/BestSellersPage'))
const NewArrivalsPage = lazy(() => import('@pages/shop/NewArrivalsPage'))
const SearchPage = lazy(() => import('@pages/shop/SearchPage'))
const ProductDetailsPage = lazy(() => import('@pages/product/ProductDetailsPage'))
const CartPage = lazy(() => import('@pages/cart/CartPage'))
const CheckoutPage = lazy(() => import('@pages/checkout/CheckoutPage'))
const PaymentPage = lazy(() => import('@pages/checkout/PaymentPage'))
const OrderSuccessPage = lazy(() => import('@pages/checkout/OrderSuccessPage'))
const AccountPage = lazy(() => import('@pages/account/AccountPage'))
const ProfilePage = lazy(() => import('@pages/account/ProfilePage'))
const AddressesPage = lazy(() => import('@pages/account/AddressesPage'))
const WishlistPage = lazy(() => import('@pages/account/WishlistPage'))
const OrderHistoryPage = lazy(() => import('@pages/account/OrderHistoryPage'))
const FaqPage = lazy(() => import('@pages/misc/FaqPage'))
const ContactPage = lazy(() => import('@pages/misc/ContactPage'))
const PrivacyPolicyPage = lazy(() => import('@pages/legal/PrivacyPolicyPage'))
const ReturnPolicyPage = lazy(() => import('@pages/legal/ReturnPolicyPage'))
const ShippingPolicyPage = lazy(() => import('@pages/legal/ShippingPolicyPage'))
const TermsPage = lazy(() => import('@pages/legal/TermsPage'))
const LoginPage = lazy(() => import('@pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@pages/auth/ForgotPasswordPage'))
const NotFoundPage = lazy(() => import('@pages/misc/NotFoundPage'))

function RouteFallback() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cream text-micro text-olive"
      role="status"
      aria-live="polite"
    >
      <span className="animate-pulse">Loading…</span>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path={ROUTES.home} element={<HomePage />} />
            <Route path={ROUTES.ourStory} element={<OurStoryPage />} />
            <Route path={ROUTES.ingredients} element={<IngredientsPage />} />
            <Route path={ROUTES.ingredientDetail} element={<IngredientDetailPage />} />
            <Route path={ROUTES.giftSets} element={<GiftSetsPage />} />
            <Route path={ROUTES.shop} element={<ShopPage />} />
            <Route path={ROUTES.skinCare} element={<SkinCarePage />} />
            <Route path={ROUTES.bodyCare} element={<BodyCarePage />} />
            <Route path={ROUTES.hairCare} element={<HairCarePage />} />
            <Route path={ROUTES.essentialOils} element={<EssentialOilsPage />} />
            <Route path={ROUTES.coldPressedOils} element={<ColdPressedOilsPage />} />
            <Route path={ROUTES.bestSellers} element={<BestSellersPage />} />
            <Route path={ROUTES.newArrivals} element={<NewArrivalsPage />} />
            <Route path={ROUTES.search} element={<SearchPage />} />
            <Route path={ROUTES.product} element={<ProductDetailsPage />} />
            <Route path={ROUTES.cart} element={<CartPage />} />
            <Route path={ROUTES.wishlist} element={<WishlistPage />} />
            <Route path={ROUTES.checkout} element={<CheckoutPage />} />
            <Route path={ROUTES.payment} element={<PaymentPage />} />
            <Route path={ROUTES.orderSuccess} element={<OrderSuccessPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path={ROUTES.account} element={<AccountPage />} />
              <Route path={ROUTES.profile} element={<ProfilePage />} />
              <Route path={ROUTES.addresses} element={<AddressesPage />} />
              <Route path={ROUTES.orderHistory} element={<OrderHistoryPage />} />
            </Route>

            <Route path={ROUTES.faq} element={<FaqPage />} />
            <Route path={ROUTES.contact} element={<ContactPage />} />
            <Route path={ROUTES.privacy} element={<PrivacyPolicyPage />} />
            <Route path={ROUTES.returns} element={<ReturnPolicyPage />} />
            <Route path={ROUTES.shipping} element={<ShippingPolicyPage />} />
            <Route path={ROUTES.terms} element={<TermsPage />} />

            <Route element={<GuestRoute />}>
              <Route path={ROUTES.login} element={<LoginPage />} />
              <Route path={ROUTES.register} element={<RegisterPage />} />
              <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
              <Route path={ROUTES.resetPassword} element={<ForgotPasswordPage />} />
            </Route>

            <Route path={ROUTES.notFound} element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
