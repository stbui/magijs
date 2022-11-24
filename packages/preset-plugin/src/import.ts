export default api => {
  api.chainWebpack(memo => {
    memo.resolve.alias
      .set('@magi/utils/react', memo.resolve.alias.get('react'))
      .set('@magi/utils/react-dom', memo.resolve.alias.get('react-dom'))
      .set('@magi/utils/js-cookie', require.resolve('js-cookie'))
      .set('@magi/utils/query-string', require.resolve('query-string'))
      .set('@magi/utils/dayjs', require.resolve('dayjs'))
      .set('@magi/utils/lodash', require.resolve('lodash'))
      .set('@magi/utils/request', require.resolve('umi-request'))
      .set('@magi/utils/classnames', require.resolve('classnames'));

    return memo;
  });
};
