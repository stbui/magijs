export default () => {
  return {
    plugins: [
      require.resolve('@umijs/plugin-esbuild'),
      require.resolve('@umijs/plugin-sass'),
      require.resolve('@umijs/plugin-antd'),
      require.resolve('@umijs/plugin-crossorigin'),
      require.resolve('@umijs/plugin-helmet'),
      require.resolve('@umijs/plugin-dva'),
      require.resolve('@umijs/plugin-access'),
      require.resolve('@umijs/plugin-initial-state'),
      require.resolve('@umijs/plugin-model'),
      require.resolve('@umijs/plugin-qiankun'),
      require.resolve('@umijs/plugin-request'),

      require.resolve('./plugins/import/import'),
      require.resolve('./plugins/lint/lint'),
    ],
  };
};
