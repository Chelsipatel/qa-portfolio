import { defineConfig } from 'vitest/config';

// This file tells Vitest (our test runner) how to behave.
// You do NOT need to understand every line yet - guide 00 explains it.
export default defineConfig({
  test: {
    // "globals: true" lets us use `describe`, `it`, and `expect`
    // without importing them at the top of every test file.
    globals: true,
    // Run in a plain Node.js environment (no browser needed for unit/integration).
    environment: 'node',
    // Only the real drills run by default. The `traps/` folder (deliberately
    // broken/flaky teaching tests) is excluded so it never affects your suite or
    // coverage — run those separately with `npm run test:traps`.
    include: ['unit/**/*.test.ts', 'integration/**/*.test.ts'],
    // Where our coverage report ("how much code did my tests touch?") goes.
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html'],
    },
  },
});
