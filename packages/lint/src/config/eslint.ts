module.exports = {
  root: true,
  extends: [
    require.resolve('eslint-config-za'),
    require.resolve('eslint-config-za/react'),
    require.resolve('eslint-config-za/typescript'),
    require.resolve('eslint-config-prettier'),
  ],
  rules: {
    indent: 'error',
  },
  parserOptions: {
    babelOptions: {
      plugins: [['@babel/plugin-proposal-decorators', { version: 'legacy' }]],
    },
  },
  ignorePatterns: ['**/*.d.ts'],
};
