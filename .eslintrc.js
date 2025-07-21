module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'next/core-web-vitals',
  ],
  plugins: ['react', '@typescript-eslint'],
  rules: {
    // Customize your rules here
    'react/react-in-jsx-scope': 'off', // Next.js does not require React in scope
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}; 