const proxy: any = {
  // 示例，代理后端接口
  dev: {
    '/nsso': {
      target: 'http://xxx.dev.com',
      logLevel: 'debug',
      changeOrigin: true,
      xfwd: true,
    },
  },
  test: {
    '/nsso': {
      target: 'http://xxx.test.com',
      logLevel: 'debug',
      changeOrigin: true,
      xfwd: true,
    },
  },
  pre: {
    '/nsso': {
      target: 'http://xxx.pre.com',
      logLevel: 'debug',
      changeOrigin: true,
      xfwd: true,
    },
  },
  prd: {
    '/nsso': {
      target: 'http://xxx.prd.com',
      logLevel: 'debug',
      changeOrigin: true,
      xfwd: true,
    },
  },
};

export default proxy;
