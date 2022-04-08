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

  rules: {},
};
