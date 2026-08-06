import { test, expect } from '@playwright/test'

const api = () => process.env.API_URL || 'http://localhost:5000'

test.describe('API smoke', () => {
  test('health is ok', async ({ request }) => {
    const res = await request.get(`${api()}/api/health`)
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.status).toBe('ok')
  })

  test('lists products', async ({ request }) => {
    const res = await request.get(`${api()}/api/products`)
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(Array.isArray(body.data.products)).toBe(true)
    expect(body.data.products.length).toBeGreaterThan(0)
  })

  test('lists categories', async ({ request }) => {
    const res = await request.get(`${api()}/api/categories`)
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.categories.length).toBeGreaterThan(0)
  })

  test('public settings include free shipping threshold', async ({ request }) => {
    const res = await request.get(`${api()}/api/settings/public`)
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.data.freeShippingThreshold).toBeGreaterThan(0)
  })

  test('rejects unauthenticated cart', async ({ request }) => {
    const res = await request.get(`${api()}/api/cart`)
    expect(res.status()).toBe(401)
  })

  test('rejects unauthenticated admin dashboard', async ({ request }) => {
    const res = await request.get(`${api()}/api/admin/dashboard`)
    expect([401, 403]).toContain(res.status())
  })

  test('register + login + me round-trip', async ({ request }) => {
    const email = `e2e_${Date.now()}@example.com`
    const password = 'TestPass123!'

    const reg = await request.post(`${api()}/api/auth/register`, {
      data: {
        name: 'E2E Shopper',
        email,
        password,
        phone: '9876543210',
      },
    })
    expect(reg.ok()).toBeTruthy()
    const regBody = await reg.json()
    expect(regBody.data.token).toBeTruthy()
    expect(regBody.data.user.email).toBe(email)

    const login = await request.post(`${api()}/api/auth/login`, {
      data: { email, password },
    })
    expect(login.ok()).toBeTruthy()
    const loginBody = await login.json()
    const token = loginBody.data.token as string

    const me = await request.get(`${api()}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(me.ok()).toBeTruthy()
    const meBody = await me.json()
    expect(meBody.data.user.email).toBe(email)
  })

  test('authenticated cart replace + get', async ({ request }) => {
    const email = `cart_${Date.now()}@example.com`
    const password = 'TestPass123!'
    await request.post(`${api()}/api/auth/register`, {
      data: { name: 'Cart User', email, password },
    })
    const login = await request.post(`${api()}/api/auth/login`, {
      data: { email, password },
    })
    const token = (await login.json()).data.token as string
    const headers = { Authorization: `Bearer ${token}` }

    const products = await request.get(`${api()}/api/products`)
    const list = (await products.json()).data.products as {
      id: string
      variants: { id: string }[]
    }[]
    expect(list.length).toBeGreaterThan(0)
    const product = list[0]
    const variantId = product.variants?.[0]?.id
    expect(variantId).toBeTruthy()

    const put = await request.put(`${api()}/api/cart`, {
      headers,
      data: {
        items: [{ productId: product.id, variantId, quantity: 2 }],
      },
    })
    expect(put.ok()).toBeTruthy()

    const get = await request.get(`${api()}/api/cart`, { headers })
    expect(get.ok()).toBeTruthy()
    const cart = await get.json()
    expect(cart.data.items.length).toBeGreaterThan(0)
    expect(cart.data.count).toBe(2)
  })

  test('order create ignores client paid status', async ({ request }) => {
    const products = await request.get(`${api()}/api/products`)
    const list = (await products.json()).data.products as {
      id: string
      variants: { id: string }[]
    }[]
    const product = list[0]
    const variantId = product.variants?.[0]?.id

    const res = await request.post(`${api()}/api/orders`, {
      data: {
        paymentMethod: 'razorpay',
        status: 'paid',
        giftWrap: false,
        shipping: {
          fullName: 'E2E Buyer',
          email: `order_${Date.now()}@example.com`,
          phone: '9876543210',
          line1: '12 Test Street',
          city: 'Bengaluru',
          state: 'KA',
          postalCode: '560001',
          country: 'India',
          shippingMethod: 'standard',
        },
        items: [{ productId: product.id, variantId, quantity: 1 }],
      },
    })

    // Guest checkout needs Mongo; memory mode returns 503
    if (res.status() === 503) {
      test.skip(true, 'Guest orders require MongoDB')
      return
    }

    expect(res.status()).toBe(201)
    const body = await res.json()
    expect(body.data.order.status).toBe('pending')
    expect(body.data.order.status).not.toBe('paid')
  })

  test('payment create requires orderNumber', async ({ request }) => {
    const res = await request.post(`${api()}/api/payments/create-order`, {
      data: { amount: 50000 },
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(String(body.message).toLowerCase()).toMatch(/order number/)
  })

  test('admin login works with seed credentials', async ({ request }) => {
    const res = await request.post(`${api()}/api/auth/login`, {
      data: {
        email: 'admin@auraofnature.com',
        password: 'Admin1234!',
      },
    })
    // Seed admin may not exist if DB never seeded — soft skip
    if (!res.ok()) {
      test.skip(true, 'Seed admin not available')
      return
    }
    const body = await res.json()
    expect(body.data.user.role).toBe('admin')
    expect(body.data.token).toBeTruthy()
  })
})
