import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'e2e.spec.ts',
  timeout: 30000,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
  },
  // Serve the static site from the project root so the JSON fetch() calls
  // (which use absolute /content/... paths) resolve correctly.
  webServer: {
    command: 'python3 -m http.server 3000',
    url: 'http://localhost:3000/index.html',
    reuseExistingServer: true,
    timeout: 20000,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
