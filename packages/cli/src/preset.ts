import { logger } from '@umijs/utils';
import type { IApi } from 'umi';

export default (api: IApi) => {
  api.onStart(() => {
    logger.info('Hello Magi@鼠');
  });

  const corePlugins = [require.resolve('./features/config'), require.resolve('./features/apptype')];

  const plugins = [
    require.resolve('@umijs/plugins/dist/access'),
    require.resolve('@umijs/plugins/dist/analytics'),
    require.resolve('@umijs/plugins/dist/dva'),
    require.resolve('@umijs/plugins/dist/initial-state'),
    require.resolve('@umijs/plugins/dist/layout'),
    require.resolve('@umijs/plugins/dist/model'),
    require.resolve('@umijs/plugins/dist/moment2dayjs'),
    require.resolve('@umijs/plugins/dist/request'),
    require.resolve('@umijs/plugins/dist/locale'),
    require.resolve('@umijs/plugins/dist/qiankun'),
    require.resolve('@umijs/plugins/dist/tailwindcss'),
  ];

  if (api.userConfig.antd) {
    plugins.push(require.resolve('@alita/plugins/dist/antd'));
  }

  //
  if (api.userConfig.vue) {
    return {
      plugins: [...corePlugins, require.resolve('@umijs/preset-vue')],
    };
  }

  return {
    plugins: [...corePlugins, ...plugins],
  };
};
