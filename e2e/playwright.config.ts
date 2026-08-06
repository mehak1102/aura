import { defineConfig, devices } from '@playwright/test'

const STOREFRONT = process.env.STOREFRONT_URL || 'http://localhost:5173'
const ADMIN = process.env.ADMIN_URL || 'http://localhost:5174'
const API = process.env.API_URL || 'http://localhost:5000'

/**
 * Whole-site automation:
 * - api: HTTP checks against Express
 * - storefront: shopper UI
 * - admin: admin panel UI
 *
 * Reuses already-running dev servers when present (CI can start them via webServer).
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts/,
      use: { baseURL: API },
    },
    {
      name: 'storefront',
      testMatch: /storefront\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: STOREFRONT,
      },
    },
    {
      name: 'admin',
      testMatch: /admin\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: ADMIN,
      },
    },
  ],
  webServer: [
    {
      command: 'npm run dev -w @aura/server',
      url: `${API}/api/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      cwd: '..',
    },
    {
      command: 'npm run dev -w @aura/client',
      url: STOREFRONT,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      cwd: '..',
    },
    {
      command: 'npm run dev -w @aura/admin',
      url: ADMIN,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      cwd: '..',
    },
  ],
})
