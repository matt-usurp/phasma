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
      ],

      reportsDirectory: 'build/coverage',
      reporter: ['text', 'html-spa'],

      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
    },
  },
});
