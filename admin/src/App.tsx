import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ADMIN_ROUTES } from '@/routes/paths'
import { AdminLayout } from '@layouts/AdminLayout'
import { ProtectedRoute } from '@components/auth/ProtectedRoute'

const DashboardPage = lazy(() => import('@pages/dashboard/DashboardPage'))
const OrdersPage = lazy(() => import('@pages/orders/OrdersPage'))
const OrderDetailPage = lazy(() => import('@pages/orders/OrderDetailPage'))
const ProductsPage = lazy(() => import('@pages/products/ProductsPage'))
const ProductFormPage = lazy(() => import('@pages/products/ProductFormPage'))
const CategoriesPage = lazy(() => import('@pages/categories/CategoriesPage'))
const UsersPage = lazy(() => import('@pages/users/UsersPage'))
const CouponsPage = lazy(() => import('@pages/coupons/CouponsPage'))
const InventoryPage = lazy(() => import('@pages/inventory/InventoryPage'))
const ReviewsPage = lazy(() => import('@pages/reviews/ReviewsPage'))
const AnalyticsPage = lazy(() => import('@pages/analytics/AnalyticsPage'))
const SalesPage = lazy(() => import('@pages/analytics/SalesPage'))
const SettingsPage = lazy(() => import('@pages/settings/SettingsPage'))
const NotificationsPage = lazy(() => import('@pages/notifications/NotificationsPage'))
const LoginPage = lazy(() => import('@pages/auth/LoginPage'))
const ChangePasswordPage = lazy(() => import('@pages/auth/ChangePasswordPage'))

function Loading() {
  return (
    <div className="grid min-h-[40vh] place-items-center text-sm text-charcoal/60">
      Loading…
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path={ADMIN_ROUTES.login} element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path={ADMIN_ROUTES.changePassword}
              element={<ChangePasswordPage />}
            />
            <Route element={<AdminLayout />}>
              <Route path={ADMIN_ROUTES.dashboard} element={<DashboardPage />} />
              <Route path={ADMIN_ROUTES.orders} element={<OrdersPage />} />
              <Route
                path={ADMIN_ROUTES.orderDetail}
                element={<OrderDetailPage />}
              />
              <Route path={ADMIN_ROUTES.products} element={<ProductsPage />} />
              <Route
                path={ADMIN_ROUTES.productCreate}
                element={<ProductFormPage />}
              />
              <Route
                path={ADMIN_ROUTES.productEdit}
                element={<ProductFormPage />}
              />
              <Route path={ADMIN_ROUTES.categories} element={<CategoriesPage />} />
              <Route path={ADMIN_ROUTES.users} element={<UsersPage />} />
              <Route path={ADMIN_ROUTES.coupons} element={<CouponsPage />} />
              <Route path={ADMIN_ROUTES.inventory} element={<InventoryPage />} />
              <Route path={ADMIN_ROUTES.reviews} element={<ReviewsPage />} />
              <Route path={ADMIN_ROUTES.analytics} element={<AnalyticsPage />} />
              <Route path={ADMIN_ROUTES.sales} element={<SalesPage />} />
              <Route path={ADMIN_ROUTES.settings} element={<SettingsPage />} />
              <Route
                path={ADMIN_ROUTES.notifications}
                element={<NotificationsPage />}
              />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to={ADMIN_ROUTES.dashboard} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
