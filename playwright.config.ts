import { defineConfig } from '@playwright/test';

const url = process.env.CI ? 'http://localhost:4173/bitterwater' : 'http://localhost:4173';

export default defineConfig({
  webServer: {
    command: process.env.CI ? 'bun run build && bun preview' : 'bun dev --port 4173',
    reuseExistingServer: !process.env.CI,
    url,
  },
  use: {
    baseURL: `${url}/`,
  },
  testDir: 'e2e',
});
