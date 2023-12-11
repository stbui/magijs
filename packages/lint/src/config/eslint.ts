module.exports = {
  root: true,
  extends: [require.resolve('eslint-config-za'), 'plugin:prettier/recommended'],
  overrides: [
    {
      files: ['**/*.jsx'],
      extends: require.resolve('eslint-config-za/react'),
    },
    {
      files: ['**/*.ts'],
      extends: require.resolve('eslint-config-za/typescript'),
    },
    {
      files: ['**/*.tsx'],
      extends: require.resolve('eslint-config-za/typescript-react'),
    },
  ],
  parserOptions: {
    babelOptions: {
      plugins: [['@babel/plugin-proposal-decorators', { version: 'legacy' }]],
    },
  },
  // 禁止内联注释
  noInlineConfig: true,
  ignorePatterns: ['**/*.d.ts'],
};
