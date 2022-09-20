module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  // parserOptions: {
  //   ecmaVersion: 8,
  //   sourceType: 'module',
  //   ecmaFeatures: {
  //     jsx: true,
  //   },
  // },
  extends: [
    require.resolve('eslint-config-za'),
    require.resolve('eslint-config-za/react'),
    require.resolve('eslint-config-za/typescript'),
  ],
  ignorePatterns: ['**/*.d.ts'],
};
