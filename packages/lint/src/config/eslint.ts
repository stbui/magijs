module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.js'],
      extends: [require.resolve('eslint-config-za'), 'plugin:prettier/recommended'],
    },
    {
      files: ['*.jsx'],
      extends: [require.resolve('eslint-config-za/react'), 'plugin:prettier/recommended'],
    },
    {
      files: ['*.ts', '*.d.ts'],
      extends: [require.resolve(require.resolve('eslint-config-za/typescript')), 'plugin:prettier/recommended'],
    },
    {
      files: ['*.tsx'],
      extends: [require.resolve(require.resolve('eslint-config-za/typescript-react')), 'plugin:prettier/recommended'],
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
