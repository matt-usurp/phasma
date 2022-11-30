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
      skipFull: true,

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

        // Package forwarding files are just type exports.
        'packages/@phasma/handler/src/index.ts',
        'packages/@phasma/handler-aws/src/index.ts',

        // Inherit markers are unexported symbols.
        'packages/@phasma/handler/src/component/middleware/inherit.ts',

        // Events file should only ever be types.
        'packages/@phasma/handler-aws/src/definition/events.ts',
      ],

      reportsDirectory: 'build/coverage',
      reporter: ['text', 'html'],

      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
});
