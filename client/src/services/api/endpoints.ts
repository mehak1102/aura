export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  products: {
    list: '/products',
    detail: (slug: string) => `/products/${slug}`,
    search: '/products/search',
    filters: '/products/filters',
  },
  categories: {
    list: '/categories',
    detail: (slug: string) => `/categories/${slug}`,
  },
  cart: {
    get: '/cart',
    add: '/cart/items',
    update: (id: string) => `/cart/items/${id}`,
    remove: (id: string) => `/cart/items/${id}`,
  },
  wishlist: {
    get: '/wishlist',
    toggle: '/wishlist/toggle',
  },
  orders: {
    list: '/orders',
    create: '/orders',
    detail: (id: string) => `/orders/${id}`,
  },
  addresses: {
    list: '/users/me/addresses',
    create: '/users/me/addresses',
    update: (id: string) => `/users/me/addresses/${id}`,
    remove: (id: string) => `/users/me/addresses/${id}`,
    setDefault: (id: string) => `/users/me/addresses/${id}/default`,
  },
  payments: {
    createOrder: '/payments/create-order',
    verify: '/payments/verify',
  },
  reviews: {
    list: (productId: string) => `/products/${productId}/reviews`,
    create: (productId: string) => `/products/${productId}/reviews`,
  },
  blogs: {
    list: '/blogs',
    detail: (slug: string) => `/blogs/${slug}`,
  },
  instagram: {
    profile: '/instagram/profile',
    feed: '/instagram/feed',
    image: '/instagram/image',
  },
  coupons: {
    validate: '/coupons/validate',
  },
  upload: {
    image: '/upload/image',
  },
  analytics: {
    dashboard: '/admin/analytics/dashboard',
  },
} as const
