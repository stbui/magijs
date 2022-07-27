module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [require.resolve('eslint-config-za'), require.resolve('eslint-config-za/react')],
  ignorePatterns: ['**/*.d.ts'],
};
