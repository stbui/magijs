import { IApi } from 'umi';

export default (api: IApi) => {
  const configDefaults: Record<string, any> = {
    vue: {},
    ...api.userConfig,
  };

  api.modifyConfig((memo: any) => {
    memo.alias.stbui = 'umi';
    Object.keys(configDefaults).forEach(key => {
      memo[key] = configDefaults[key];
    });
    return memo;
  });

  api.registerPlugins([
    {
      id: `magi: config-vue`,
      key: 'vue',
      config: {
        schema(joi) {
          return joi.object();
        },
      },
    },
  ]);
};
