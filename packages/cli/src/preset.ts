import { logger } from '@umijs/utils';
import type { IApi } from 'umi';

export default (api: IApi) => {
  api.onStart(() => {
    logger.info('Hello Magi@鼠');
  });

  const corePlugins = [
    require.resolve('./features/apptype'),
    require.resolve('@magijs/preset-plugin/lib/ship'),
    require.resolve('@magijs/preset-plugin/lib/xflow'),
    require.resolve('@magijs/preset-plugin/lib/seraph'),
    require.resolve('@magijs/preset-plugin/lib/sentry'),
  ];

  const plugins = [
    require.resolve('@umijs/plugins/dist/access'),
    require.resolve('@umijs/plugins/dist/analytics'),
    require.resolve('@umijs/plugins/dist/dva'),
    require.resolve('@umijs/plugins/dist/initial-state'),
    require.resolve('@umijs/plugins/dist/model'),
    require.resolve('@umijs/plugins/dist/moment2dayjs'),
    require.resolve('@umijs/plugins/dist/request'),
    require.resolve('@umijs/plugins/dist/locale'),
    require.resolve('@umijs/plugins/dist/tailwindcss'),
  ];

  if (api.userConfig.antd) {
    plugins.push(require.resolve('@umijs/plugins/dist/antd'));
    plugins.push(require.resolve('@umijs/plugins/dist/layout'));
  }

  if (api.userConfig.qiankun) {
    plugins.push(require.resolve('@umijs/plugins/dist/qiankun'));
  }

  return {
    plugins: [...corePlugins, ...plugins],
  };
};
