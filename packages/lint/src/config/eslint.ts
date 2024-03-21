module.exports = {
  root: true,
  rules: {
    'no-template-curly-in-string': 'off',
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      extends: [
        require.resolve('eslint-config-za'),
        require.resolve('eslint-config-za/react'),
        'plugin:prettier/recommended',
      ],
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        require.resolve(require.resolve('eslint-config-za/typescript')),
        require.resolve(require.resolve('eslint-config-za/typescript-react')),
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      settings: {
        'import/external-module-folders': ['node_modules', 'node_modules/@types'],
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
        },
        'import/resolver': {
          node: { extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx', '.mjs', '.mjsx', '.cjs', '.cjsx'] },
        },
      },
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
