import { defineConfig, devices } from '@playwright/test'

const e2eFingerprint = `203.0.113.${(Date.now() % 200) + 1}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:3100',
    trace: 'on-first-retry',
    extraHTTPHeaders: {
      'x-forwarded-for': e2eFingerprint,
    },
  },
  webServer: {
    command: 'pnpm db:migrate:runtime && pnpm dev --port 3100',
    url: 'http://127.0.0.1:3100',
    env: {
      DATABASE_URL:
        process.env.DATABASE_URL ??
        'postgresql://expedition33:expedition33@127.0.0.1:5432/expedition33',
      SESSION_SECRET: 'expedition-33-e2e-session-secret',
    },
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
})
