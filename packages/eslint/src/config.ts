module.exports = {
  root: true,
  extends: [
    require.resolve('eslint-config-za'),
    require.resolve('eslint-config-za/react'),
    require.resolve('eslint-config-za/typescript'),
  ],
  ignorePatterns: ['**/*.d.ts'],
};
