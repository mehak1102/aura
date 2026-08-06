import { test, expect } from '@playwright/test'

test.describe('Admin panel', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /admin sign in/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test('rejects non-admin customer credentials', async ({ page, request }) => {
    const api = process.env.API_URL || 'http://localhost:5000'
    const email = `cust_${Date.now()}@example.com`
    const password = 'TestPass123!'

    const reg = await request.post(`${api}/api/auth/register`, {
      data: { name: 'Customer', email, password },
    })
    if (!reg.ok()) {
      test.skip(true, 'Could not register customer for admin gate test')
      return
    }

    await page.goto('/login')
    await page.getByLabel(/email/i).fill(email)
    await page.getByLabel(/password/i).fill(password)
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText(/admin access required|sign in failed|failed/i)).toBeVisible({
      timeout: 15_000,
    })
  })

  test('seed admin can sign in (or is prompted to change password)', async ({
    page,
  }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('admin@auraofnature.com')
    await page.getByLabel(/password/i).fill('Admin1234!')
    await page.getByRole('button', { name: /sign in/i }).click()

    // Either dashboard, change-password gate, or login error if not seeded
    await page.waitForTimeout(2000)
    const url = page.url()
    const body = await page.locator('body').innerText()

    if (/sign in failed|invalid|incorrect/i.test(body) && url.includes('/login')) {
      test.skip(true, 'Seed admin not available in this environment')
      return
    }

    expect(
      url.includes('/change-password') ||
        url.endsWith('/') ||
        /dashboard|orders|products|change password/i.test(body),
    ).toBeTruthy()
  })

  test('protected routes redirect guests to login', async ({ page }) => {
    await page.goto('/orders')
    await expect(page).toHaveURL(/\/login/)
  })
})
