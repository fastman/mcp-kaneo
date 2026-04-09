import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts', 'docs/test-integration/*.test.ts'],
    testTimeout: 30000,
  },
});