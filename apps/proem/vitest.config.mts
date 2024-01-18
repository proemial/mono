import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.spec.ts?(x)'],
    environment: 'node',
    globals: true,
  },
})
