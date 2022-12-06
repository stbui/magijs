import { IApi } from 'umi';

export default (api: IApi) => {
  api.addExtraBabelPlugins(() => {
    return api.config.antd.import && !api.appData.vite
      ? [
          [
            require.resolve('babel-plugin-import'),
            { libraryName: 'dragon-ui', style: true, camel2DashComponentName: false },
          ],
        ]
      : [];
  });
};
