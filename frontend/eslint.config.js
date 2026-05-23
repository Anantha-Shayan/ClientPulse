import js from '@eslint/js';

const browserGlobals = {
  clearTimeout: 'readonly',
  console: 'readonly',
  document: 'readonly',
  localStorage: 'readonly',
  setTimeout: 'readonly',
  window: 'readonly'
};

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: browserGlobals
    },
    rules: {
      'no-unused-vars': 'off'
    }
  }
];
