import { defineConfig as configure } from 'vitest/config';

export default configure({
  test: {
    globals: true,
    environment: 'node',
    passWithNoTests: true,

    include: [
      'packages/**/*.test.{js,jsx,ts,tsx}',
    ],

    coverage: {
      all: true,
      clean: true,

      include: [
        'packages/**/*',
      ],

      exclude: [
        'packages/**/examples',
        'packages/**/*.proof.*',
        'packages/**/*.test.ts',

        'packages/index.ts',
        'packages/phasma/src/index.ts',
        'packages/create-phasma/src/index.ts',

        // Events file should only ever be types.
        'packages/@phasma/handler-aws/src/definition/events.ts',
      ],

      reportsDirectory: 'build/coverage',
      reporter: ['text', 'html-spa'],

      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
});
