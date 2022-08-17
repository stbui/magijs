import chalk from '@magijs/compiled/chalk';
import { join } from 'path';
import { BundlerConfigType, IApi } from 'umi';

import runtime from './runtime';
import sentryTs from './sentry';

export default (api: IApi) => {
  api.describe({
    key: 'sentry',
    config: {
      schema(joi) {
        return joi.object();
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
    enableBy() {
      return api.EnableBy.config && api.env !== 'development';
    },
  });

  const { sentry } = api.userConfig;

  if (!sentry) {
    return;
  }

  if (!sentry.dsn) {
    console.log(chalk.red(`${chalk.green('[sentry]')} dsn 没有配置`));
    return;
  }

  if (!sentry.authToken) {
    console.log(chalk.yellow(`${chalk.green('[sentry]')} authToken 没有配置, sourceMap功能未开启}`));
  }

  if (!sentry.org) {
    console.log(chalk.yellow(`${chalk.green('[sentry]')} org 没有配置, sourceMap功能未开启}`));
  }

  const {
    dsn,
    environment = api.env || 'dev',
    project = sentry.project || api.pkg.name,
    release = sentry.version || api.pkg.version || '1.0.0',
    authToken,
    org,
    ...other
  } = sentry;

  // authToken && org && project 都申请配置好，启用sourceMap 功能
  if (authToken && org && project) {
    api.modifyConfig(memo => {
      memo.devtool = 'source-map';
      return memo;
    });

    api.chainWebpack((memo, { type }) => {
      if (type === BundlerConfigType.csr) {
        const sentryConfig = {
          authToken,
          org,
          project,
          release,
          environment,
          include: './dist',
          ...other,
        };

        const sentry = require('@sentry/webpack-plugin');

        memo.plugin('sentry').use(sentry, [sentryConfig]);
      }
      return memo;
    });
  }

  api.onGenerateFiles(() => {
    api.writeTmpFile({
      path: 'plugin-monitor-sentry/sentry.tsx',
      content: sentryTs(dsn),
    });

    api.writeTmpFile({
      path: 'plugin-monitor-sentry/runtime.tsx',
      content: runtime(),
    });
  });

  api.addRuntimePluginKey(() => ['sentry']);
  api.addRuntimePlugin(() => api.utils.winPath(join(api.paths.absTmpPath!, 'plugin-monitor-sentry/runtime.tsx')));
};
