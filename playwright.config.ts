import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: process.env.CI ? 'bun run build && bun preview' : 'bun dev --port 4173',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: process.env.CI ? 'http://127.0.0.1:4173/bitterwater/' : 'http://127.0.0.1:4173/',
  },
  testDir: 'e2e',
});
