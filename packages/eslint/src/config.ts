module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [require.resolve('eslint-config-za'), require.resolve('eslint-config-za/react')],
  ignorePatterns: ['**/*.d.ts'],
};
