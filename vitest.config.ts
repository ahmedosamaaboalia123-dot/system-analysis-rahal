import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/**/*.test.ts', 'tests/**/*.test.{ts,mjs}'],
    reporters: ['default', 'json'],
    outputFile: { json: 'artifacts/s02/vitest.json' },
  },
});
