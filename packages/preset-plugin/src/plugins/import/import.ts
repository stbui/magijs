import { IApi } from 'umi';

export default (api: IApi) => {
  api.modifyBabelPresetOpts(opts => {
    const importLibs = [
      {
        libraryName: '@magi/magi/antd',
        libraryDirectory: 'es',
        style: true,
      },
    ];

    return { ...opts, import: (opts.import || []).concat(importLibs) };
  });
};
