import { IApi } from 'umi';

const INVALID_PKGS = ['umi', 'umi-request', 'dva', 'qiankun'];

export function validate(dependencies: any) {
  const keys = Object.keys(dependencies);
  for (const key of keys) {
    if (INVALID_PKGS.includes(key)) return false;
    // if (key.startsWith(`@umijs/`)) return false;
    // if (key.startsWith(`@ant-design/`)) return false;
    // if (key.startsWith(`@magi/`)) return false;
    // if (key.startsWith(`@za/`)) return false;
  }
  return true;
}

export default (api: IApi, opts: any) => {
  api.onPluginReady(async () => {
    const { dependencies = {}, devDependencies = {} } = api.pkg || {};
    const resolutions = api.pkg?.resolutions;
    if (!validate(dependencies) || !validate(devDependencies)) {
      opts.printError({
        exit: true,
        why: `请删除在 package.json 里的声明： "${opts.highlight(JSON.stringify(INVALID_PKGS))} 。"`,
      });
    }
  });
};
