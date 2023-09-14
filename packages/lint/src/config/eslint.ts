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
    /** 避免用一个字母命名，让你的命名有意义 */
    'id-length': 'error',
    /** 用小驼峰命名法来命名你的对象、函数、实例 */
    camelcase: 'error',
    /** 用大驼峰命名法来命名类 */
    'new-cap': 'error',
    /** 不要用前置或后置下划线 */
    'no-underscore-dangle': 'error',
  },
  parserOptions: {
    babelOptions: {
      plugins: [['@babel/plugin-proposal-decorators', { version: 'legacy' }]],
    },
  },
  // 禁止内联注释
  noInlineConfig: true,
  ignorePatterns: ['**/*.d.ts'],
};
