import { defineConfig } from 'vitest/config'

export default defineConfig({
  optimizeDeps: {
    include: ['lit', 'axe-core']
  },
  test: {
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
      headless: true
    }
  }
})
