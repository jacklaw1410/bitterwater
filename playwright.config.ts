import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: process.env.CI ? 'bun run build && bun preview' : 'bun dev --port 4173',
    port: 4173,
  },
  testDir: 'e2e',
});
