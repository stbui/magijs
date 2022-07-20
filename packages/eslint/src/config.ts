module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ['eslint-config-za', 'eslint-config-za/react'],
  ignorePatterns: ['**/*.d.ts'],
};
