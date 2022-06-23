import { IApi } from 'umi';

/**
 * 帮助开发提升效率工具
 */
export default (api: IApi) => {
  const MAGI_APP_INFO = `
    var MAGI_APP_INFO = {
        env: {
            SHIP_DEPLOY_ENV: '${process.env.DEPLOY_ENV}',
            MAGI_ENV: '${process.env.MAGI_ENV}',
            MAGI_VERSION: '${process.env.MAGI_VERSION}',
            NODE_ENV: '${process.env.NODE_ENV}',
            DEPLOY_MODE: '${process.env.SHIP}',
        },
        project: {
            name: '${api.pkg.name}',
            version: '${api.pkg.version}',
        },
        api: ${JSON.stringify(api.userConfig?.proxy)},
        deps: {
            core: '${process.env.UMI_VERSION}',
            magi: '${process.env.MAGI_VERSION}',
            react: '${require('react/package').version}',
            zarm: '${require('zarm/package').version}',
            antd: '${require('antd/package').version}',
            sentry: '${require('@sentry/browser').version}',
        },
    };    
    `;

  api.describe({
    key: 'tool',
    config: {
      schema(joi) {
        return joi.object();
      },
    },
    enableBy: api.EnableBy.config,
  });
};
