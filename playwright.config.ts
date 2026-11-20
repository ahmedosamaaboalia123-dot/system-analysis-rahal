import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 20_000,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: Boolean(process.env.CI),
  outputDir: 'artifacts/s02/browser',
  reporter: [['list'], ['json', { outputFile: 'artifacts/s02/playwright.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node packages/s02-fixture/dist/server.js',
    url: 'http://127.0.0.1:4173/__s02/health',
    timeout: 15_000,
    reuseExistingServer: false,
  },
});
