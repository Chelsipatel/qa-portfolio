import { defineConfig, devices } from '@playwright/test';

// This tells Playwright (our browser-automation tool) how to run.
// Guide 04 (visual) and 05 (E2E) explain everything here in plain English.
export default defineConfig({
  // Look for browser tests in these two folders.
  testDir: '.',
  testMatch: ['visual/**/*.spec.ts', 'e2e/**/*.spec.ts'],

  // Before the tests run, Playwright starts our little demo dashboard for us,
  // then shuts it down afterwards. No manual steps for you.
  webServer: {
    command: 'node e2e/demo-app/serve.mjs',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
    timeout: 30_000,
  },

  use: {
    baseURL: 'http://localhost:4321',
    // Capture a screenshot and a trace when something fails - great for learning
    // WHY a test failed.
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
