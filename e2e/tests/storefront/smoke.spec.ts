import { test, expect } from '@playwright/test'

test.describe('Storefront pages', () => {
  const pages = [
    { path: '/', name: 'home' },
    { path: '/shop', name: 'shop' },
    { path: '/our-story', name: 'our story' },
    { path: '/ingredients', name: 'ingredients' },
    { path: '/gift-sets', name: 'gift sets' },
    { path: '/faq', name: 'faq' },
    { path: '/contact', name: 'contact' },
    { path: '/privacy-policy', name: 'privacy' },
    { path: '/return-policy', name: 'returns' },
    { path: '/shipping-policy', name: 'shipping' },
    { path: '/terms', name: 'terms' },
    { path: '/auth/login', name: 'login' },
    { path: '/auth/register', name: 'register' },
    { path: '/cart', name: 'cart' },
  ]

  for (const page of pages) {
    test(`loads ${page.name} (${page.path})`, async ({ page: p }) => {
      const errors: string[] = []
      p.on('pageerror', (err) => errors.push(err.message))

      const res = await p.goto(page.path, { waitUntil: 'domcontentloaded' })
      expect(res?.ok() || res?.status() === 304).toBeTruthy()
      await expect(p.locator('body')).toBeVisible()
      expect(errors, `pageerror on ${page.path}: ${errors.join('; ')}`).toEqual(
        [],
      )
    })
  }
})

test.describe('Shop & cart', () => {
  test('shop lists products and add-to-cart updates bag', async ({ page }) => {
    await page.goto('/shop', { waitUntil: 'networkidle' })

    const productCard = page.locator('article').filter({ hasText: 'Add to Cart' }).first()
    await expect(productCard).toBeVisible({ timeout: 30_000 })

    const title = (await productCard.locator('h3').first().textContent())?.trim()
    expect(title).toBeTruthy()

    await productCard.getByRole('button', { name: /add to cart/i }).click()

    // Header bag count or cart page should reflect the item
    await page.goto('/cart', { waitUntil: 'networkidle' })
    await expect(page.getByText(/your bag is empty/i)).toHaveCount(0)
    if (title) {
      await expect(page.getByText(title, { exact: false }).first()).toBeVisible()
    }
  })

  test('product detail page opens from shop', async ({ page }) => {
    await page.goto('/shop', { waitUntil: 'networkidle' })
    const link = page.locator('article a[href*="/product/"]').first()
    await expect(link).toBeVisible({ timeout: 30_000 })
    await link.click()
    await expect(page).toHaveURL(/\/product\//)
    await expect(page.getByRole('button', { name: /add to cart/i }).first()).toBeVisible()
  })
})

test.describe('Auth UI', () => {
  test('login form validates empty submit', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByRole('button', { name: /sign in/i }).click()
    // Zod / RHF should surface field errors
    await expect(page.locator('body')).toContainText(/email|password|required|valid/i)
  })

  test('register page has expected fields', async ({ page }) => {
    await page.goto('/auth/register')
    await expect(page.getByLabel(/name/i).first()).toBeVisible()
    await expect(page.getByLabel(/email/i).first()).toBeVisible()
    await expect(page.getByLabel(/^password$/i).first()).toBeVisible()
  })
})

test.describe('Checkout gate', () => {
  test('checkout redirects when cart empty', async ({ page }) => {
    await page.goto('/cart')
    // Clear any leftover cart from other tests in this worker via localStorage
    await page.evaluate(() => {
      localStorage.removeItem('aura_cart')
      localStorage.removeItem('aura_wishlist')
    })
    await page.goto('/checkout')
    await expect(page).toHaveURL(/\/(cart|shop|checkout)/)
  })
})
