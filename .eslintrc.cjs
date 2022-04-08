/* eslint-disable no-undef */

module.exports = {
  root: true,

  env: {
    commonjs: true,
    node: true,
    es6: true,
  },

  parser: '@typescript-eslint/parser',
  parserOptions: {
    createDefaultProgram: false,
    ecmaVersion: 2020,
    sourceType: 'module',
  },

  plugins: [
    '@typescript-eslint',
  ],

  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  rules: {
    /**
     * Disabled due to controlled usage of `namespace` blocks only used for type information.
     * This is still true for cases where code exists but we are using ESM style imports/exports.
     */
    '@typescript-eslint/no-namespace': 'off',
  },
};
