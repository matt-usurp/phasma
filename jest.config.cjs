/* eslint-disable no-undef */

module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',

  maxWorkers: 5,
  maxConcurrency: 3,

  modulePaths: [
    '<rootDir>/packages/**',
  ],

  modulePathIgnorePatterns: [
    '<rootDir>/build/package',
    '<rootDir>/build/workspace',
  ],

  collectCoverage: true,
  coverageDirectory: 'build/coverage',
  collectCoverageFrom: [
    'packages/**/*.{js,ts}',
  ],

  coveragePathIgnorePatterns: [
    'examples',

    // Proof files are used for testing type use cases and not functionality.
    // These can be ignored from coverage as they are pseudo code.
    '\.proof\.ts$',

    // The main export for the @phasma/handler package is just types.
    // However it uses namespaces which trigger as code branches within coverage.
    'packages/@phasma/handler/src/index.ts',
  ],

  coverageReporters: [
    'html',
  ],

  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
